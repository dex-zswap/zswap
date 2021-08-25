import { useMemo } from 'react'
import { useTranslation } from 'contexts/Localization'
import useLotteryReward from 'views/Tickets/hooks/useLotteryReward'

import styled from 'styled-components'
import { Flex, Text } from 'zswap-uikit'

const Line = styled.div`
  width: 100%;
  border-top: 3px dashed #fff;
  margin: 34px 0;
`

const PriceWrap = styled(Flex)`
  flex-wrap: wrap;
  > div {
    margin: 0 75px 35px 0;
  }
`

const PriceRule = ({ lotteryId }) => {
  const { t } = useTranslation()
  const { zustValue, zbRewards } = useLotteryReward(lotteryId)

  const priceData = useMemo(() => {
    return new Array(7).fill('').map((d, index) => {
      const isLast = index == 6
      const per = [0.4, 0.2, 0.1, 0.05, 0.03, 0.02, 0.2]
      d = {
        color: isLast ? 'pink' : 'blue',
        title: isLast ? 'Burn' : `${index + 1}${t('st Prize')}`,
        subTitle: `${t('Match all ')}6`,
        earn: `${zustValue.times(per[index]).integerValue()} ZBst each`,
        winner: `123 ${t('Winners')}`,
      }
      return d
    })
  }, [zustValue, zbRewards])

  console.log(priceData)

  return (
    <>
      <Line />
      <Text style={{ color: '#999' }} mb="30px">
        {t('Match the winning number in the same order to share prizes. Current prizes for winning:')}
      </Text>
      <PriceWrap>
        {priceData.map(({ color, title, subTitle, earn, winner }, index) => (
          <div key={index}>
            <Text color={color} mb="3px" bold>
              {title}
            </Text>
            {subTitle && (
              <Text mb="3px" bold>
                {subTitle}
              </Text>
            )}
            <Text fontSize="24px" bold>
              {earn}
            </Text>
            <Text>{earn}</Text>
            <Text>{winner}</Text>
          </div>
        ))}
      </PriceWrap>
    </>
  )
}

export default PriceRule
