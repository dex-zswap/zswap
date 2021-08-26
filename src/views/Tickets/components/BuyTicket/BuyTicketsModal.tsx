import React, { useState, useCallback, useEffect, useMemo } from 'react'

import { Text, Input, Flex, Modal, Button } from 'zswap-uikit'
import useTicketPrice, { useZBSTBalance } from 'views/Tickets/hooks/useTicketPrice'
import useApprove, { useApproveStatus } from 'views/Tickets/hooks/useApprove'
import useBuy, { useCurrentLotteryId } from 'views/Tickets/hooks/useBuy'
import useRandomNumbers from 'views/Tickets/hooks/useRandomNumbers'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'

const InputWrap = styled(Flex)`
  width: 100%;
  height: 90px;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  background: #2c2c2c;
  border-radius: 14px;
  padding: 15px 15px;
  margin-bottom: 20px;
`

const Line = styled.div`
  width: 100%;
  height: 1px;
  background: #f7f7f7;
  margin-bottom: 22px;
`

const EditInputWrap = styled.div`
  width: 26px;
  height: 26px;
  border: 1px solid #f7f7f7;
  border-radius: 50%;
`

enum Steps {
  INPUT_COUNT = 1,
  VIEW_EDIT_NUMBER = 2,
}

const ViewEditNumbers = ({ count, numbersChange }) => {
  const { t } = useTranslation()
  const [numbers, setNumbers] = useState(useRandomNumbers(count))
  const pages = Math.ceil(numbers.length / 5)
  const [pageNum, setPageNum] = useState(1)
  const [pageNumbers, setPageNumbers] = useState(numbers.slice(0, 5))
  const getOrderStr = useCallback((index) => `#${(index + (pageNum - 1) * 5 + 1 + '').padStart(3, '0')}`, [pageNum])
  const numberChange = useCallback(
    (e, index, numIndex) => {
      const value = e.target.value.trim()
      const nums = numbers.map((nums, wrapIndex) => {
        if (index === wrapIndex) {
          nums.splice(numIndex, 1, value ? Number(value) : 0)
        }
        return nums
      })
      setNumbers(nums)
    },
    [numbers],
  )

  useEffect(() => {
    setPageNumbers(numbers.slice((pageNum - 1) * 5, pageNum * 5))
  }, [numbers, pageNum])

  useEffect(() => {
    numbersChange(numbers)
  }, [numbers])

  return (
    <>
      <Text mb="30px">{t('Your ticket numbers')}</Text>
      {pageNumbers.map((nums, wrapperIndex) => {
        return (
          <Flex mb="15px" justifyContent="space-between" alignItems="center" key={nums.join('')}>
            <Text bold>{getOrderStr(wrapperIndex)}</Text>
            <Flex justifyContent="space-between" alignItems="center">
              {nums.map((num: number, numIndex: number) => {
                return (
                  <EditInputWrap style={{ marginLeft: numIndex ? '9px' : 0 }} key={`${num}-${numIndex}`}>
                    <Input
                      style={{ textAlign: 'center', padding: 0, borderRadius: '50%', width: '100%', height: '100%' }}
                      hasBg
                      maxLength={1}
                      value={num}
                      onChange={(e) => numberChange(e, wrapperIndex, numIndex)}
                    />
                  </EditInputWrap>
                )
              })}
            </Flex>
          </Flex>
        )
      })}
      {pages > 1 && (
        <Flex mt="15px" justifyContent="center" alignItems="center">
          <Button
            padding="0"
            scale="sm"
            variant="text"
            mr="8px"
            disabled={pageNum == 1}
            onClick={() => {
              setPageNum((pageNum) => --pageNum)
            }}
          >{`<`}</Button>
          <Text>{`Page ${pageNum} of ${pages}`}</Text>
          <Button
            padding="0"
            scale="sm"
            variant="text"
            ml="8px"
            disabled={!(pageNum < pages)}
            onClick={() => {
              setPageNum((pageNum) => ++pageNum)
            }}
          >{`>`}</Button>
        </Flex>
      )}
    </>
  )
}

interface BuyTicketModalProps {
  onDismiss?: () => void
}

const PricePay = ({ count, ticketPrice }) => {
  const { t } = useTranslation()

  return (
    <Flex mb="24px" justifyContent="space-between" alignItems="center">
      <Text>{t('You pay')}:</Text>
      <Text fontSize="20px" bold>
        {count && ticketPrice?.multipliedBy(count)?.toFixed(2)} ZBst
      </Text>
    </Flex>
  )
}

const BuyTicketModal: React.FC<BuyTicketModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const [step, setStep] = useState(Steps.INPUT_COUNT)
  const [count, setCount] = useState<number | string>(1)
  const [numbers, setNumbers] = useState([])

  const needApprove = useApproveStatus()
  const { approve, approving } = useApprove()

  const lotteryNum = useCurrentLotteryId()

  const { buyTickets, buying } = useBuy()
  const zbstBalance = useZBSTBalance()
  const ticketPrice = useTicketPrice()

  const countChange = useCallback((e) => {
    let count = parseInt(e.target.value.trim()) as number
    if (count === Number(count)) {
      if (count > 100) {
        count = 100
        e.target.value = count
      }
      setCount(count)
    } else {
      setCount('')
      e.target.value = ''
    }
  }, [])

  const numbersChange = useCallback((nums) => {
    setNumbers(nums)
  }, [])

  const buy = useCallback(() => {
    buyTickets(numbers, lotteryNum)
  }, [buyTickets, numbers])

  const backInput = useCallback(() => {
    setStep(Steps.INPUT_COUNT)
  }, [])

  const viewTickets = useCallback(() => {
    setStep(Steps.VIEW_EDIT_NUMBER)
  }, [])

  const FooterButtons = useMemo(() => {
    if (needApprove) {
      return (
        <Button isLoading={approving} onClick={approve}>
          {t('Enable')}
        </Button>
      )
    }

    if (step === Steps.INPUT_COUNT) {
      return <Button onClick={viewTickets}>{t('View Edit Numbers')}</Button>
    }

    return (
      <Button isLoading={buying} onClick={buy}>
        {t('Confirm and Buy')}
      </Button>
    )
  }, [step, needApprove, buy, viewTickets, approve, approving, buying])

  const onBack = step === Steps.VIEW_EDIT_NUMBER ? backInput : undefined

  return (
    <Modal onBack={onBack} onDismiss={onDismiss} title={t('Buy Tickets')} minWidth="360px">
      {step === Steps.INPUT_COUNT && (
        <>
          <Flex mb="18px" justifyContent="space-between" alignItems="center">
            <Text bold>{t('Buy')}:</Text>
            <Text bold>{t('Tickets')}</Text>
          </Flex>
          <InputWrap>
            <Input
              style={{ padding: 0, fontWeight: 600, textAlign: 'right' }}
              hasBg
              scale="sm"
              value={count}
              onChange={countChange}
            />
            <Text textAlign="right">{ticketPrice?.multipliedBy(1)?.toFixed(2)} ZBst</Text>
          </InputWrap>
          <Text textAlign="right" mb="26px">
            {t('ZBst Balance')}: {zbstBalance?.toFixed(2)}
          </Text>
          <Line />
          <PricePay count={count} ticketPrice={ticketPrice} />
        </>
      )}
      {step === Steps.VIEW_EDIT_NUMBER && (
        <>
          <ViewEditNumbers count={count} numbersChange={numbersChange} />
          <Line style={{ margin: '20px 0' }} />
          <PricePay count={count} ticketPrice={ticketPrice} />
        </>
      )}
      {FooterButtons}
    </Modal>
  )
}

export default BuyTicketModal
