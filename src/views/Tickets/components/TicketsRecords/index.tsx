import { useTranslation } from 'contexts/Localization'
import { useCurrentLotteryId } from 'views/Tickets/hooks/useBuy'
import { useUserLotteryIds } from 'views/Tickets/hooks/useUserHistory'
import { useWinNumbers } from 'views/Tickets/hooks/usePrizes'

import styled from 'styled-components'
import { Text, Input, Flex, Modal, Button } from 'zswap-uikit'
import { useMemo, useEffect, useCallback, useState } from 'react'

const NumWrap = styled(Flex)`
  align-items: center;
  .ticket-num {
    width: 22px;
    height: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    border: 1px solid #f7f7f7;
    border-radius: 50%;
    margin-right: 5px;
    &:nth-child(7) {
      margin-right: 0;
    }
  }
`

interface TicketsRecordsProps {
  id?: string
  onlyShowWin?: boolean
  setTickData?: (winNumber: any, totalTickNum: number, winTickNum: number) => void
}

const TicketsRecords: React.FC<TicketsRecordsProps> = ({ id, onlyShowWin = false, setTickData }) => {
  const { t } = useTranslation()
  const lotteryId = id || useCurrentLotteryId()
  const lotteryIds = useUserLotteryIds(lotteryId)
  const winNumbers = useWinNumbers(lotteryId)

  const getRewardLevel = useCallback(
    (num: string) => {
      const numArr = num.split('')
      const winNumbersStr = winNumbers.join('')
      if (num == winNumbersStr) {
        return t('1st Prize')
      }
      if (numArr[0] == winNumbers[0] && numArr[4] == winNumbers[4]) {
        return t('2nd Prize')
      }
      if (numArr[0] == winNumbers[0] && numArr[3] == winNumbers[3]) {
        return t('3rd Prize')
      }
      if (numArr[0] == winNumbers[0] && numArr[2] == winNumbers[2]) {
        return t('4th Prize')
      }
      if (numArr[0] == winNumbers[0] && numArr[1] == winNumbers[1]) {
        return t('5th Prize')
      }
      if (numArr[0] == winNumbers[0] || numArr[5] == winNumbers[5]) {
        return t('6th Prize')
      }
      return t('No Prize')
    },
    [winNumbers],
  )

  const totalTicks = useMemo(() => lotteryIds[0]?.numbers || [], [lotteryIds])

  const winTicks = useMemo(() => totalTicks.filter((d) => t('No Prize') != getRewardLevel(d))[0] || [], [totalTicks])

  const numbers = useMemo(() => (onlyShowWin ? winTicks : totalTicks), [onlyShowWin, totalTicks, winTicks])

  const pages = useMemo(() => Math.ceil(numbers.length / 5), [numbers])

  const [pageNum, setPageNum] = useState(1)
  const [pageNumbers, setPageNumbers] = useState(numbers.slice(0, 5))

  const getOrderStr = useCallback((index) => `#${(index + (pageNum - 1) * 5 + 1 + '').padStart(3, '0')}`, [pageNum])

  useEffect(() => {
    setTickData && setTickData(winNumbers, totalTicks.length, winTicks.length)
    setPageNumbers(numbers.slice((pageNum - 1) * 5, pageNum * 5))
  }, [numbers, pageNum])

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb="25px">
        <Text>{onlyShowWin ? t('Winning Number') : t('Your ticket numbers')}</Text>
        <Text>{t('Prize Bracket')}</Text>
      </Flex>
      {pageNumbers.map((numWrap: string, index: number) => (
        <Flex key={index} justifyContent="space-between" alignItems="center" mb="16px">
          <NumWrap>
            <Text mr="55px" bold>
              {getOrderStr(index)}
            </Text>
            {numWrap.split('').map((num: string, nIndex: number) => (
              <div className="ticket-num" key={nIndex}>
                {num}
              </div>
            ))}
          </NumWrap>
          <Text bold>{getRewardLevel(numWrap)}</Text>
        </Flex>
      ))}
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

export default TicketsRecords
