import { useContext, useMemo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { LotteryContext } from 'contexts/Lottery'
import BigNumber from 'bignumber.js'
import { useHasOpened } from 'views/Tickets/hooks/useWinTime'
import useLotteryReward from 'views/Tickets/hooks/useLotteryReward'
import { useAllUserLotteryIdsByLotteryNum } from 'views/Tickets/hooks/useUserHistory'

import styled from 'styled-components'
import { Skeleton, Flex, Text } from 'zswap-uikit'

const Line = styled.div`
  width: 100%;
  border-top: 3px dashed #fff;
  margin: 34px 0;
`

const PriceWrap = styled(Flex)`
  flex-wrap: wrap;
  > div {
    width: calc((100% - 90px) / 4);
    margin: 0 30px 35px 0;
    &:nth-child(4n) {
      margin-right: 0;
    }
  }
`

const PriceRule = ({ lotteryId }) => {
  const { t } = useTranslation()
  const { currentLotteryId, currentZustValue, currentZbRewards } = useContext(LotteryContext)

  const isCurrent = currentLotteryId == lotteryId
  const { zustValue, zbRewards } = useLotteryReward(lotteryId)
  const zust = !isCurrent ? zustValue : currentZustValue
  const zb = !isCurrent ? zbRewards : currentZbRewards
  const rewardNums = useAllUserLotteryIdsByLotteryNum(lotteryId)
  const priceData = useMemo(
    () =>
      new Array(7).fill('').map((d, index) => {
        const isLast = index == 6
        const per = [0.4, 0.2, 0.1, 0.05, 0.03, 0.02, 0.2]
        const zbReward = '- ZBST' == zb ? zb : new BigNumber(zb.split(' ZBST')[0]).times(per[index]).integerValue()
        d = {
          isLast,
          color: isLast ? 'pink' : 'blue',
          title: isLast
            ? t('Burn')
            : t(`${index + 1}${!index ? 'st' : 1 == index ? 'nd' : 2 == index ? 'rd' : 'th'} Prize`),
          subTitle: t(`Match ${index ? 'first' : 'all'} ${6 - index}${5 == index ? ' or last 1' : ''}`),
          reward:
            '$-' == zust ? zust : '$' + new BigNumber(zust.split('$')[1]).times(per[index]).integerValue().toFixed(0),
          zbReward: '- ZBST' == zbReward ? zbReward : zbReward.toFixed(0) + ' ZBST',
          earn: `${rewardNums[index] && '- ZBST' != zbReward ? zbReward.idiv(rewardNums[index]) : 0} ZBST ${t('each')}`,
          winner: `${rewardNums[index] ?? 0} ${t('Winners')}`,
        }
        return d
      }),
    [lotteryId, zust, zb, rewardNums, isCurrent, t],
  )

  return (
    <>
      <Line />
      <Text style={{ color: '#999' }} mb="30px">
        {t('Match the winning number in the same order to share prizes. Current prizes for winning:')}
      </Text>
      <PriceWrap>
        {priceData.map(({ isLast, color, title, subTitle, reward, zbReward, earn, winner }, index) => (
          <div key={index}>
            <Text color={color} mb="3px" bold>
              {title}
            </Text>
            {!isLast && (
              <Text color={color} mb="3px" bold>
                {subTitle}
              </Text>
            )}
            <Text fontSize="24px" bold>
              {'$-' == reward ? <Skeleton width="175px" height="35px" margin="10px 0" /> : reward}
            </Text>
            <Text>{'- ZBST' == zbReward ? <Skeleton width="175px" height="25px" /> : zbReward}</Text>
            {!isCurrent && !isLast && (
              <>
                <Text>{earn}</Text>
                <Text>{winner}</Text>
              </>
            )}
          </div>
        ))}
      </PriceWrap>
    </>
  )
}

export default PriceRule
