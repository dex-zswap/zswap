import styled from 'styled-components'
import { Text, Flex } from 'zswap-uikit'
import Card from './Card'

import { useTranslation } from 'contexts/Localization'

const TicketDrawWrap = styled.div`
  position: relative;
  margin-bottom: 200px;
  img {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    &:first-child {
      top: 100px;
      transform: translateX(-430px);
    }
    &:nth-child(2) {
      top: 50px;
      transform: translateX(-520px);
    }
    &:nth-child(3) {
      top: 20px;
      transform: translateX(400px);
    }
  }
`

const NumWrap = styled.div`
  width: 58px;
  height: 58px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 32px;
  font-weight: bold;
  margin-right: 16px;
  background: linear-gradient(135deg, #f866ff 0%, #0050ff 100%);
  border-radius: 16px;
`

const TicketDraw = () => {
  const { t } = useTranslation()

  return (
    <TicketDrawWrap>
      <img width="65px" src="/images/tickets/obj_3_1.png" />
      <img width="22px" src="/images/tickets/obj_2_2.png" />
      <img width="197px" src="/images/tickets/obj_3_2.png" />
      <Text textAlign="center" fontSize="48px" margin="0 auto 75px" bold>
        {t('Get your tickets now!')}
      </Text>
      <Flex mb="120px" alignItems="center" justifyContent="center">
        <NumWrap>06</NumWrap>
        <Text fontSize="24px" mr="16px" color="blue" bold>
          HH
        </Text>
        <NumWrap>23</NumWrap>
        <Text fontSize="24px" mr="16px" color="blue" bold>
          MM
        </Text>
        <Text fontSize="24px" bold>
          {t('until the draw')}
        </Text>
      </Flex>
      <Card title={t('Round') + '5'} subTitle={t('Draw') + ': 24 Dec 2021  14:00'}></Card>
    </TicketDrawWrap>
  )
}

export default TicketDraw
