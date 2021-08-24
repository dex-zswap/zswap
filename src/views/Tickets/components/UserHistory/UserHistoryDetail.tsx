import { useCallback, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import useLotteryReward from 'views/Tickets/hooks/useLotteryReward'
import { useWinNumbers } from 'views/Tickets/hooks/usePrizes'
import { useUserLotteryIds } from 'views/Tickets/hooks/useUserHistory'

import styled from 'styled-components'
import { Text, Flex, Button } from 'zswap-uikit'
import PriceRule from '../PriceRule'

const BallWrap = styled(Flex)`
  align-items: center;
  > div {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 23px;
    font-weight: bold;
    color: #fff;
    margin-right: 15px;
    &:first-child,
    &:last-child {
      background: url(/images/tickets/ball_1.png) center / contain no-repeat;
    }
    &:nth-child(2),
    &:nth-child(4) {
      background: url(/images/tickets/ball_2.png) center / contain no-repeat;
    }
    &:nth-child(3),
    &:nth-child(5) {
      background: url(/images/tickets/ball_3.png) center / contain no-repeat;
    }
    &:last-child {
      margin-right: 0;
    }
  }
`

const UserHistoryDetail = ({ lotteryId }) => {
  const { t } = useTranslation()
  const { zustValue, zbRewards } = useLotteryReward(lotteryId)
  const winNumbers = useWinNumbers(lotteryId)
  const BallArr = new Array(6).fill('ball')
  const lotteryIds = useUserLotteryIds(lotteryId)
  const ticketsNum = useCallback(
    () => lotteryIds.filter((d) => d.id == lotteryId)[0]?.numbers.length || '0',
    [lotteryIds],
  )

  return (
    <>
      <Text style={{ color: '#999', margin: '-10px 0 30px 3px' }}>Drawn 12 Aug 2021, 02:00</Text>
      <Flex>
        <Text mr="46px" bold>
          {t('Price Pot')}
        </Text>
        <div>
          <Text fontSize="36px" lineHeight="36px" mb="5px" color="blue" bold>
            ${zbRewards.toFixed(2)}
          </Text>
          <Text ml="4px">{zustValue.toFixed(2)} ZBst</Text>
        </div>
      </Flex>
      <Flex margin="25px 0 34px">
        <div style={{ marginRight: '46px' }}>
          <Text bold>{t('Winning')}</Text>
          <Text bold>{t('Number')}</Text>
        </div>
        <BallWrap>
          {BallArr.map((num, index) => (
            <div key={num + index}>{winNumbers[index] || '-'}</div>
          ))}
        </BallWrap>
      </Flex>
      <Text margin="0 auto 27px" textAlign="center" bold>
        {t('You have')}
        {` ${ticketsNum()} `}
        {t('tickets this round.')}
      </Text>
      <Flex justifyContent="center">
        <Button>{t('View your Tickets')}</Button>
      </Flex>
      <PriceRule lotteryId={lotteryId} />
    </>
  )
}

export default UserHistoryDetail
