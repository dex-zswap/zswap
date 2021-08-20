import styled from 'styled-components'
import { baseColors } from 'zswap-uikit/theme/colors'
import { ButtonWrap } from '../Wrapper'
import { Flex, Text, Image, Button } from 'zswap-uikit'
import { useTranslation } from 'contexts/Localization'

const Wrap = styled(Flex)`
  position: relative;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @keyframes rotateX {
    0% {
      transform: translate3d(0, 0, 0) perspective(50px) rotateX(0) rotateY(-2deg) scale3d(1, 1, 1);
    }
    50% {
      transform: translate3d(10px, 20px, 0) perspective(50px) rotateX(0) rotateY(2deg) scale3d(1, 1, 1);
    }
    100% {
      transform: translate3d(0, 0, 0) perspective(50px) rotateX(0) rotateY(-2deg) scale3d(1, 1, 1);
    }
  }

  .banner_ab-img {
    position: absolute;
    left: 10%;
    top: 80px;
    animation: 6s rotateX linear infinite both;
  }
`

const CountdowmnLabel = styled.div`
  text-align: center;
  padding: 5px 30px;
  background: #0050ff;
  border-radius: 16px;
  margin-bottom: 40px;
`

const NumBoxWrap = styled(Flex)`
  align-items: center;
  justify-content: center;
  margin-bottom: 80px;
`

const NumBox = styled(Flex)`
  align-items: center;
  justify-content: center;
  min-width: 58px;
  height: 58px;
  border-radius: 16px;
  padding: 0 10px;
  margin: 0 15px;
  background: linear-gradient(135deg, #f866ff 0%, #0050ff 100%);
  border-radius: 16px;
`

const TextContainer = styled(Flex)`
  justify-content: center;
  margin-bottom: 60px;
  > div {
    margin-right: 60px;
    &:last-child {
      margin-right: 0;
    }
  }
`

const TextWrap = styled(Flex)`
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Footer = () => {
  const pinkColor = { color: baseColors.primary }
  const { t } = useTranslation()

  return (
    <Wrap>
      <Text lineHeight="54px" color="text" fontSize="48px" marginBottom="60px" bold>
        {t('Total Liquidity Bet')}
        <span style={pinkColor}> 25888800</span>
        <span> {t('USDT')}</span>
      </Text>
      <CountdowmnLabel>
        <Text color="text" fontSize="18px" bold>
          {t('Halving Countdown')}
        </Text>
      </CountdowmnLabel>
      <NumBoxWrap>
        <NumBox>
          <Text color="text" fontSize="32px" bold>
            26
          </Text>
        </NumBox>
        <Text color="text" fontSize="24px" bold>
          {t('DD')}
        </Text>
        <NumBox>
          <Text color="text" fontSize="32px" bold>
            06
          </Text>
        </NumBox>
        <Text color="text" fontSize="24px" bold>
          {t('HH')}
        </Text>
        <NumBox>
          <Text color="text" fontSize="32px" bold>
            23
          </Text>
        </NumBox>
        <Text color="text" fontSize="24px" bold>
          {t('MM')}
        </Text>
        <NumBox>
          <Text color="text" fontSize="32px" bold>
            28
          </Text>
        </NumBox>
        <Text color="text" fontSize="24px" bold>
          {t('SS')}
        </Text>
      </NumBoxWrap>
      <TextContainer>
        <TextWrap>
          <Text color="text" fontSize="20px" bold>
            {t('ZBst')}
          </Text>
          <Text color="text" fontSize="20px" bold>
            {t('Current Price')}
          </Text>
          <Text color="text" fontSize="34px" bold>
            <span style={pinkColor}>$0.8</span>
            <span>{t('USDT')}</span>
          </Text>
        </TextWrap>
        <TextWrap>
          <Text color="text" fontSize="20px" bold>
            {t('Reward')}
          </Text>
          <Text color="text" fontSize="20px" bold>
            {t('Amount')}
          </Text>
          <Text color="primary" fontSize="34px" bold>
            $8088100
          </Text>
        </TextWrap>
        <TextWrap>
          <Text color="text" fontSize="20px" bold>
            {t('Total Repurchase')}
          </Text>
          <Text color="text" fontSize="20px" bold>
            {t('and Destruction')}
          </Text>
          <Text color="primary" fontSize="34px" bold>
            881000
          </Text>
        </TextWrap>
        <TextWrap>
          <Text color="text" fontSize="20px" bold>
            {t('Destroyed')}
          </Text>
          <Text color="text" fontSize="20px" bold>
            {t('ZBst')}
          </Text>
          <Text color="primary" fontSize="34px" bold>
            882000
          </Text>
        </TextWrap>
        <TextWrap>
          <Text color="text" fontSize="20px" bold>
            {t('Repurchased')}
          </Text>
          <Text color="text" fontSize="20px" bold>
            {t('and Destroyed ZB')}
          </Text>
          <Text color="primary" fontSize="34px" bold>
            88000000
          </Text>
        </TextWrap>
      </TextContainer>
      <ButtonWrap>
        <Button width="152px">{t('Buy Now')}</Button>
        <Button width="152px" variant="secondary">
          {t('Learn More')}
        </Button>
      </ButtonWrap>
      <Image className="banner_ab-img" width={47} height={46} src="/images/home/banner/obj_4_1.png" />
    </Wrap>
  )
}

export default Footer
