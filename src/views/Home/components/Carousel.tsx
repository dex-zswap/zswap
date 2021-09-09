import { BASE_URL } from 'config'
import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Flex, Text, Image } from 'zswap-uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'

const Wrap = styled(Flex)`
  align-items: center;
  justify-content: center;
  padding-top: 150px;
  margin-bottom: 200px;

  @keyframes rotateX {
    0% {
      transform: translate3d(0, 0, 0) perspective(100px) rotateX(0) rotateY(-8deg) scale3d(1, 1, 1);
    }
    50% {
      transform: translate3d(0, 10px, 0) perspective(100px) rotateX(0) rotateY(8deg) scale3d(1, 1, 1);
    }
    100% {
      transform: translate3d(0, 0, 0) perspective(100px) rotateX(0) rotateY(-8deg) scale3d(1, 1, 1);
    }
  }

  @keyframes circle {
    0% {
      transform: translate3d(0, 0, 0) scale(0.98);
    }
    25% {
      transform: translate3d(10px, 0, 0) scale(1.02);
    }
    50% {
      transform: translate3d(10px, 15px, 0) scale(1.02);
    }
    75% {
      transform: translate3d(0, 15px, 0) scale(1.02);
    }
    100% {
      transform: translate3d(0, 0, 0) scale(0.98);
    }
  }

  @keyframes ball {
    0% {
      transform: translate3d(0, 0, 0) scale(0.9);
    }
    25% {
      transform: translate3d(-15px, 0, 0) scale(1.05);
    }
    50% {
      transform: translate3d(-15px, 20px, 0) scale(1.05);
    }
    75% {
      transform: translate3d(0, 20px, 0) scale(1.05);
    }
    100% {
      transform: translate3d(0, 0, 0) scale(0.9);
    }
  }
`

const TextWrap = styled.div`
  width: 560px;
  position: relative;
  word-breal: break-word;
  > div,
  > button {
    position: relative;
    z-index: 99;
  }
`

const ImgWrap = styled.div`
  width: 490px;
  position: relative;
  margin-left: 20px;
  > div {
    z-index: 99;
  }
`

const BlueBg = styled.div`
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: #0050fe;
  filter: blur(150px);
  position: absolute !important;
  left: 0;
  right: 0;
  top: 20px;
  bottom: 0;
  margin: auto;
  z-index: 66 !important;
`

const PinkBg = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #f866ff;
  filter: blur(100px);
  position: absolute;
  left: 80px;
  top: 0;
  z-index: 66;
`

const AbsoluteImgZ = styled.div`
  width: 647px;
  position: absolute;
  bottom: -110px;
  left: -60px;
  z-index: 66 !important;
`

const AbsoluteImgPlus = styled.div`
  width: 74px;
  position: absolute;
  top: 10px;
  left: 60px;
  animation: 5s rotateX linear infinite both;
`

const AbsoluteImgCircle = styled.div`
  width: 57px;
  position: absolute;
  top: 180px;
  left: -5px;
  animation: 9s circle linear infinite both;
`

const AbsoluteImgBall = styled.div`
  width: 63px;
  position: absolute;
  bottom: 10px;
  right: -70px;
  animation: 5s circle linear infinite both;
`

const Carousel = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  return (
    <Wrap>
      <TextWrap>
        <Text lineHeight="52px" color="primary" fontSize="48px" bold>
          ZSwap
        </Text>
        <Text lineHeight="52px" color="text" fontSize="48px" marginTop="10px" bold>
          {t('The Most Advanced Decentralized Platform in the Universe')}
        </Text>
        <Text color="text" fontSize="18px" margin="40px 0 30px">
          {t('More advanced and more convenient, easily complete the cryptocurrency exchange and win high bonuses')}
        </Text>
        {!account && <ConnectWalletButton scale="md" />}
        <BlueBg />
      </TextWrap>
      <ImgWrap>
        <Image width={490} height={371} src="/images/home/carousel/obj_1.png" />
        <AbsoluteImgZ>
          <Image width={647} height={375} src="/images/home/carousel/obj_2.png" />
        </AbsoluteImgZ>
        <AbsoluteImgPlus>
          <Image width={74} height={74} src="/images/home/carousel/obj_3.png" />
        </AbsoluteImgPlus>
        <AbsoluteImgCircle>
          <Image width={57} height={56} src="/images/home/carousel/obj_4.png" />
        </AbsoluteImgCircle>
        <AbsoluteImgBall>
          <Image width={63} height={64} src="/images/home/carousel/obj_5.png" />
        </AbsoluteImgBall>
        <PinkBg />
      </ImgWrap>
    </Wrap>
  )
}

export default Carousel
