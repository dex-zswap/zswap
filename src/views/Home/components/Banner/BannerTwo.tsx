import React from 'react'
import styled from 'styled-components'
import { baseColors } from 'zswap-uikit/theme/colors'
import { Wrap, ButtonWrap, TextWrap } from '../Wrapper'
import { Text, Image, Button } from 'zswap-uikit'
import LearnMoreBtn from 'components/LearnMoreBtn'
import { useTranslation } from 'contexts/Localization'
import history from '../../../../routerHistory'

const ImgWrap = styled.div`
  width: 322px;
  height: 618px;
  position: relative;

  @keyframes rotateX {
    0% {
      transform: translate3d(0, 0, 0) perspective(50px) rotateX(0) rotateY(-2deg) scale3d(1, 1, 1);
    }
    50% {
      transform: translate3d(0, 15px, 0) perspective(50px) rotateX(0) rotateY(2deg) scale3d(1, 1, 1);
    }
    100% {
      transform: translate3d(0, 0, 0) perspective(50px) rotateX(0) rotateY(-2deg) scale3d(1, 1, 1);
    }
  }

  .banner_ab-img {
    position: absolute;
  }
  .banner_ab-img1 {
    left: -140px;
    bottom: 119px;
  }
  .banner_ab-img2 {
    right: -90px;
    bottom: 63px;
    animation: 5s rotateX linear infinite both;
  }
`

const PinkBg = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: #f866ff;
  filter: blur(150px);
  position: absolute !important;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  z-index: 66 !important;
`

const BlueBg = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: #0050fe;
  filter: blur(200px);
  position: absolute !important;
  right: 20%;
  top: -20%;
  z-index: 66 !important;
`

const BannerTwo = () => {
  const pinkColor = { color: baseColors.primary }
  const { t } = useTranslation()

  return (
    <Wrap>
      <TextWrap>
        <Text lineHeight="54px" color="text" fontSize="48px" bold>
          {t('Trade any Tokens')}
          <span style={pinkColor}> {t('without Registration')}</span>
        </Text>
        <Text lineHeight="20px" color="text" fontSize="18px" marginTop="30px">
          {t('Simply connect your wallet to trade any tokens on DEX Smart chain')}
        </Text>
        <ButtonWrap>
          <Button width="152px" onClick={() => history.push('/swap')}>
            {t('Trade Now')}
          </Button>
          <LearnMoreBtn width="152px" href="https://zswap.gitbook.io/zswap/chan-p/untitled/dai-bi-jiao-huan" />
        </ButtonWrap>
      </TextWrap>
      <ImgWrap>
        <Image width={322} height={618} src="/images/home/banner/obj_2_1.png" />
        <Image
          className="banner_ab-img banner_ab-img1"
          width={133}
          height={133}
          src="/images/home/banner/obj_2_2.png"
        />
        <Image
          className="banner_ab-img banner_ab-img2"
          width={237}
          height={188}
          src="/images/home/banner/obj_2_3.png"
        />
      </ImgWrap>
      <PinkBg />
      <BlueBg />
    </Wrap>
  )
}

export default BannerTwo
