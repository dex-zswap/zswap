import { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { baseColors } from 'zswap-uikit/theme/colors'
import { Flex, Text, Image, Button } from 'zswap-uikit'
import LearMoreBtn from 'components/LearMoreBtn'
import { useTranslation } from 'contexts/Localization'
import { useZBSTZUSTPrice } from 'hooks/useZUSDPrice'
import useInterval from 'hooks/useInterval'
import { getHalfDownInfo } from 'config/constants/zswap/online-time'
import { ButtonWrap } from '../Wrapper'

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
      transform: translate3d(15px, 25px, 0) perspective(50px) rotateX(0) rotateY(2deg) scale3d(1, 1, 1);
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

const TextMinWidth = styled(Text)`
  min-width: 34px;
  max-width: auto;
  text-align: center;
`

const TextWrap = styled(Flex)`
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Footer = () => {
  const [halfDownInfo, setHalfDownInfo] = useState(getHalfDownInfo())

  const pinkColor = { color: baseColors.primary }
  const { t } = useTranslation()
  const history = useHistory()
  const zbstPrice = useZBSTZUSTPrice()

  useInterval(() => {
    setHalfDownInfo(getHalfDownInfo())
  }, 1000)

  return (
    <Wrap>
      {halfDownInfo?.isCounting && (
        <>
          <CountdowmnLabel>
            <Text color="text" fontSize="18px" bold>
              {t('Halving Countdown')}
            </Text>
          </CountdowmnLabel>
          <NumBoxWrap>
            <NumBox>
              <TextMinWidth color="text" fontSize="32px" bold>
                {halfDownInfo?.days}
              </TextMinWidth>
            </NumBox>
            <Text color="text" fontSize="24px" bold>
              {t('DD')}
            </Text>
            <NumBox>
              <TextMinWidth color="text" fontSize="32px" bold>
                {halfDownInfo?.hours}
              </TextMinWidth>
            </NumBox>
            <Text color="text" fontSize="24px" bold>
              {t('HH')}
            </Text>
            <NumBox>
              <TextMinWidth color="text" fontSize="32px" bold>
                {halfDownInfo?.minutes}
              </TextMinWidth>
            </NumBox>
            <Text color="text" fontSize="24px" bold>
              {t('MM')}
            </Text>
            <NumBox>
              <TextMinWidth color="text" fontSize="32px" bold>
                {halfDownInfo?.seconds}
              </TextMinWidth>
            </NumBox>
            <Text color="text" fontSize="24px" bold>
              {t('SS')}
            </Text>
          </NumBoxWrap>
        </>
      )}
      <TextContainer>
        <TextWrap>
          <Text color="text" fontSize="20px" bold>
            {t('ZBST')}
          </Text>
          <Text color="text" fontSize="20px" bold>
            {t('Current Price')}
          </Text>
          <Text color="text" fontSize="34px" bold>
            <span style={pinkColor}>${zbstPrice?.toSignificant(6)}</span>
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
        {/* <TextWrap>
          <Text color="text" fontSize="20px" bold>
            {t('Total Repurchase')}
          </Text>
          <Text color="text" fontSize="20px" bold>
            {t('and Destruction')}
          </Text>
          <Text color="primary" fontSize="34px" bold>
            881000
          </Text>
        </TextWrap> */}
        <TextWrap>
          <Text color="text" fontSize="20px" bold>
            {t('Destroyed')}
          </Text>
          <Text color="text" fontSize="20px" bold>
            {t('ZBST')}
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
        <Button width="152px" onClick={() => history.push('/farms')}>
          {t('Buy Now')}
        </Button>
        <LearMoreBtn width="152px" href="https://www.baidu.com" />
      </ButtonWrap>
      <Image className="banner_ab-img" width={47} height={46} src="/images/home/banner/obj_4_1.png" />
    </Wrap>
  )
}

export default Footer
