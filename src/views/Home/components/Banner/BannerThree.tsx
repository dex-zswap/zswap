import React from 'react'
import styled from 'styled-components'
import { baseColors } from 'zswap-uikit/theme/colors'
import { Wrap, ButtonWrap, TextWrap } from '../Wrapper'
import { Text, Image, Button } from 'zswap-uikit'
import { useTranslation } from 'contexts/Localization'

const ImgWrap = styled.div`
  width: 410px;
  height: 475px;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;

  @keyframes rotateX {
    0% {
      transform: translate3d(0, 0, 0) perspective(50px) rotateX(0) rotateY(-2deg) scale3d(1, 1, 1);
    }
    50% {
      transform: translate3d(5px, 8px, 0) perspective(50px) rotateX(0) rotateY(2deg) scale3d(1, 1, 1);
    }
    100% {
      transform: translate3d(0, 0, 0) perspective(50px) rotateX(0) rotateY(-2deg) scale3d(1, 1, 1);
    }
  }

  .banner_ab-img {
    position: absolute;
    top: -57px;
    left: -66px;
    animation: 6s rotateX linear infinite both;
  }
`

const BannerTwo = () => {
  const blueColor = { color: baseColors.blue }
  const { t } = useTranslation()

  return (
    <Wrap>
      <ImgWrap>
        <Image width={395} height={472} src="/images/home/banner/obj_3_1.png" />
        <Image className="banner_ab-img" width={188} height={187} src="/images/home/banner/obj_3_2.png" />
      </ImgWrap>
      <TextWrap>
        <Text lineHeight="54px" color="text" fontSize="48px" bold>
          {t('Earn')}
          <span style={blueColor}> {t('Passive income')}</span>
          <span> {t('through cryptocurrency')}</span>
        </Text>
        <Text lineHeight="20px" color="text" fontSize="18px" marginTop="30px">
          {t('Earn more cryptocurrency income through pledge mining')}.
        </Text>
        <ButtonWrap>
          <Button width="152px">{t('Get it Now')}</Button>
          <Button width="152px" variant="secondary">
            {t('Learn More')}
          </Button>
        </ButtonWrap>
      </TextWrap>
    </Wrap>
  )
}

export default BannerTwo
