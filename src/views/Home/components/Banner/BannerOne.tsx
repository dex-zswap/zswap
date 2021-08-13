import React from 'react'
import styled from 'styled-components'
import { Wrap, ButtonWrap, TextWrap } from '../Wrapper'
import { Text, Image, Button } from 'zswap-uikit'
import { useTranslation } from 'contexts/Localization'

const ImgWrap = styled.div`
  width: 434px;
  height: 600px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  .banner_ab-img {
    position: absolute;
    z-index: 99;
  }
  .banner_ab-img1 {
    top: 0;
    left: 20px;
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
  }
  .banner_ab-img5 {
    top: 90px;
    right: 84px;
  }
  .banner_ab-img6 {
    right: 0;
    bottom: 200px;
  }
`

const BannerOne = () => {
  const { t } = useTranslation()

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
          {t('Lottery is in progress')}.
        </Text>
        <Text lineHeight="54px" color="text" fontSize="48px" bold>
          {t('Win more than')}
        </Text>
        <Text lineHeight="54px" color="blue" fontSize="48px" bold>
          $2250000
        </Text>
        <Text lineHeight="20px" color="text" fontSize="18px" marginTop="30px">
          {t('Fair game on a chain')},
        </Text>
        <Text lineHeight="22px" color="text" fontSize="18px">
          {t('win bonuses')}.
        </Text>
        <ButtonWrap>
          <Button width="152px">{t('Join Now')}</Button>
          <Button width="152px" variant="secondary">
            {t('Learn More')}
          </Button>
        </ButtonWrap>
      </TextWrap>
    </Wrap>
  )
}

export default BannerOne
