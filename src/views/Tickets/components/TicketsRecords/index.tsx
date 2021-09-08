import { useMemo, useEffect, useCallback, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { useUserLotteryIds } from 'views/Tickets/hooks/useUserHistory'
import { useWinNumbers } from 'views/Tickets/hooks/usePrizes'

import styled from 'styled-components'
import { Text, Flex, Button } from 'zswap-uikit'
import BuyTicketsButton from '../BuyTicket/BuyTicketsButton'

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
  currentLotteryId: number
  id?: string
  onlyShowWin?: boolean
  setTickData?: (winNumber: any, totalTickNum: number, winTickNum: number) => void
}

const TicketsRecords: React.FC<TicketsRecordsProps> = ({ currentLotteryId, id, onlyShowWin = false, setTickData }) => {
  const { t } = useTranslation()
  const lotteryId = Number(id) || currentLotteryId
  const isCurrentLottery = Number(id) == currentLotteryId
  const lotteryIds = useUserLotteryIds(lotteryId.toString())
  const winNumbers = useWinNumbers(lotteryId)

  const getRewardLevel = useCallback(
    (num: string) => {
      const numArr = num.split('')
      const winNumbersStr = winNumbers.join('')
      if (num == winNumbersStr) {
        return t('1st Prize')
      }
      if (num == winNumbersStr.slice(0, 5)) {
        return t('2nd Prize')
      }
      if (num == winNumbersStr.slice(0, 4)) {
        return t('3rd Prize')
      }
      if (num == winNumbersStr.slice(0, 3)) {
        return t('4th Prize')
      }
      if (num == winNumbersStr.slice(0, 2)) {
        return t('5th Prize')
      }
      if (numArr[0] == winNumbers[0] || numArr[5] == winNumbers[5]) {
        return t('6th Prize')
      }
      return t(isCurrentLottery ? 'No Prizes' : 'No Prize')
    },
    [winNumbers, isCurrentLottery],
  )

  const totalTicks = useMemo(() => lotteryIds[0]?.numbers || [], [lotteryIds])

  const winTicks = useMemo(
    () => totalTicks.filter((d: string) => ![t('No Prize'), t('No Prizes')].includes(getRewardLevel(d))) || [],
    [totalTicks],
  )

  const numbers = onlyShowWin ? winTicks : totalTicks

  const pages = useMemo(() => Math.ceil(numbers.length / 5), [numbers])

  const [pageNum, setPageNum] = useState(1)
  const [pageNumbers, setPageNumbers] = useState([])

  const getOrderStr = useCallback((index) => `#${(index + (pageNum - 1) * 5 + 1 + '').padStart(3, '0')}`, [pageNum])

  useEffect(() => {
    setTickData && setTickData(winNumbers, totalTicks.length, winTicks.length)
    setPageNumbers(numbers.slice((pageNum - 1) * 5, pageNum * 5))
  }, [numbers, pageNum])
  const showLabel = (onlyShowWin && numbers?.length) || !onlyShowWin

  return (
    <>
      {showLabel && (
        <Flex justifyContent="space-between" alignItems="center" mb="25px">
          <Text>{onlyShowWin ? t('Winning Number') : t('Your ticket numbers')}</Text>
          <Text>{t('Prize Bracket')}</Text>
        </Flex>
      )}
      {pageNumbers &&
        pageNumbers.map &&
        pageNumbers.map((numWrap: string, index: number) => (
          <Flex key={index} justifyContent="space-between" alignItems="center" mb="16px">
            <NumWrap>
              <Text width="44px" mr="55px" bold>
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
      {onlyShowWin && !numbers?.length && (
        <>
          <Text textAlign="center">{t('You have not won any prizes')}</Text>
          <Flex justifyContent="center" m="20px 0 0">
            <BuyTicketsButton />
          </Flex>
        </>
      )}
    </>
  )
}

export default TicketsRecords
