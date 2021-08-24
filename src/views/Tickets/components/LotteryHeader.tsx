import styled from 'styled-components'
import { Text, Flex } from 'zswap-uikit'
import BuyTicketsButton from './BuyTicketsButton'
import { useTranslation } from 'contexts/Localization'
import usePrizes from '../hooks/usePrizes'

const HeaderWrap = styled(Flex)`
  position: relative;
  margin: 80px 0 200px;
  padding-top: 40px;
  align-items: center;
  flex-direction: column;
  .ab-img {
    position: absolute;
    &:first-child {
      top: 0;
      transform: translateX(-280px);
    }
    &:nth-child(2) {
      top: 55px;
      transform: translateX(-400px);
    }
    &:nth-child(3) {
      top: 155px;
      transform: translateX(-400px);
    }
    &:nth-child(4) {
      top: 255px;
      transform: translateX(-300px);
    }
    &:nth-child(5) {
      top: 70px;
      transform: translateX(380px);
    }
    &:nth-child(6) {
      top: 250px;
      transform: translateX(450px);
    }
    &:nth-child(7) {
      top: 340px;
      transform: translateX(320px);
    }
  }
`

const LotteryHeader = () => {
  const { t } = useTranslation()
  const prizes = usePrizes()
  console.log(prizes)

  return (
    <HeaderWrap>
      <img className="ab-img" width="47px" src="/images/tickets/obj_1.png" />
      <img className="ab-img" width="43px" src="/images/tickets/obj_2.png" />
      <img className="ab-img" width="203px" src="/images/tickets/obj_3.png" />
      <img className="ab-img" width="57px" src="/images/tickets/obj_4.png" />
      <img className="ab-img" width="179px" src="/images/tickets/obj_5.png" />
      <img className="ab-img" width="64px" src="/images/tickets/obj_6.png" />
      <img className="ab-img" width="23px" src="/images/tickets/obj_7.png" />
      <Text fontSize="48px" lineHeight="60px" bold>
        {t('ZSwap Lottery')}
      </Text>
      <Text fontSize="48px" lineHeight="60px" color="pink" bold>
        ${prizes.toFixed(2)}
      </Text>
      <Text mb="25px" fontSize="48px" lineHeight="60px" bold>
        {t('in prizes')}
      </Text>
      <Text mb="28px" fontSize="30px" bold>
        {t('Buy tickets, win big prizes!')}
      </Text>
      <BuyTicketsButton marginBottom="38px" />
      <img style={{ zIndex: 9 }} width="34px" src="/images/tickets/obj_9.png" />
      <img style={{ marginTop: '-50px' }} width="290px" src="/images/tickets/obj_8.png" />
    </HeaderWrap>
  )
}

export default LotteryHeader
