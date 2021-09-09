import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Text, Image, Button } from 'zswap-uikit'
import LearnMoreBtn from 'components/LearnMoreBtn'
import { Wrap, ButtonWrap, TextWrap } from 'views/Home/components/Wrapper'
import { useCurrentLotteryId } from 'views/Tickets/hooks/useBuy'
import usePrizes from 'views/Tickets/hooks/usePrizes'
import { useTranslation } from 'contexts/Localization'

const ImgWrap = styled.div`
  width: 434px;
  height: 600px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;

  @keyframes rotateX {
    0% {
      transform: translate3d(0, 0, 0) perspective(50px) rotateX(0) rotateY(-1deg) scale3d(1, 1, 1);
    }
    50% {
      transform: translate3d(0, 10px, 0) perspective(50px) rotateX(0) rotateY(1deg) scale3d(1, 1, 1);
    }
    100% {
      transform: translate3d(0, 0, 0) perspective(50px) rotateX(0) rotateY(-1deg) scale3d(1, 1, 1);
    }
  }

  @keyframes rotateX2 {
    0% {
      transform: translate3d(0, 0, 0) perspective(50px) rotateX(0) rotateY(-2deg) scale3d(1, 1, 1);
    }
    50% {
      transform: translate3d(15px, 0, 0) perspective(50px) rotateX(0) rotateY(2deg) scale3d(1, 1, 1);
    }
    100% {
      transform: translate3d(0, 0, 0) perspective(50px) rotateX(0) rotateY(-2deg) scale3d(1, 1, 1);
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
      transform: translate3d(10px, 10px, 0) scale(1.02);
    }
    75% {
      transform: translate3d(0, 15px, 0) scale(1.02);
    }
    100% {
      transform: translate3d(0, 0, 0) scale(0.98);
    }
  }

  .banner_ab-img {
    position: absolute;
    z-index: 99;
  }
  .banner_ab-img1 {
    top: 0;
    left: 20px;
    animation: 5s rotateX linear infinite both;
  }
  .banner_ab-img2 {
    right: -54px;
    top: 50px;
    z-index: 66;
  }
  .banner_ab-img3 {
    left: 0;
    right: 0;
    bottom: 84px;
    margin: auto;
    z-index: 66;
  }
  .banner_ab-img4 {
    left: 60px;
    bottom: 200px;
    animation: 5s circle linear infinite both;
  }
  .banner_ab-img5 {
    top: 90px;
    right: 84px;
    animation: 9s circle linear infinite both;
  }
  .banner_ab-img6 {
    right: 0;
    bottom: 200px;
    animation: 8s rotateX2 linear infinite both;
  }
`

const BannerOne = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const lotteryId = useCurrentLotteryId()
  const { currentZustValue } = usePrizes(lotteryId)

  return (
    <Wrap>
      <ImgWrap>
        <Image width={434} height={181} src="/images/home/banner/obj_1_6.png" />
        <Image
          className="banner_ab-img banner_ab-img1"
          width={289}
          height={223}
          src="/images/home/banner/obj_1_1.png"
        />
        <Image
          className="banner_ab-img banner_ab-img2"
          width={206}
          height={206}
          src="/images/home/banner/obj_1_3.png"
        />
        <Image className="banner_ab-img banner_ab-img3" width={34} height={405} src="/images/home/banner/obj_1_4.png" />
        <Image className="banner_ab-img banner_ab-img4" width={61} height={61} src="/images/home/banner/obj_1_5.png" />
        <Image className="banner_ab-img banner_ab-img5" width={25} height={25} src="/images/home/banner/obj_1_7.png" />
        <Image
          className="banner_ab-img banner_ab-img6"
          width={269}
          height={216}
          src="/images/home/banner/obj_1_2.png"
        />
      </ImgWrap>
      <TextWrap>
        <Text lineHeight="54px" color="text" fontSize="48px" bold>
          {t('Lottery is in progress')}
        </Text>
        <Text lineHeight="54px" color="text" fontSize="48px" bold>
          {t('Win more than')}
        </Text>
        <Text lineHeight="54px" color="blue" fontSize="48px" bold>
          {currentZustValue}
        </Text>
        <Text lineHeight="20px" color="text" fontSize="18px" marginTop="30px">
          {t('Fair game on a chain')}
        </Text>
        <Text lineHeight="22px" color="text" fontSize="18px">
          {t('win bonuses')}
        </Text>
        <ButtonWrap>
          <Button width="152px" onClick={() => history.push('/lottery')}>
            {t('Join Now')}
          </Button>
          <LearnMoreBtn width="152px" href="https://zswap.gitbook.io/zswap/chan-p/cai-piao" />
        </ButtonWrap>
      </TextWrap>
    </Wrap>
  )
}

export default BannerOne
