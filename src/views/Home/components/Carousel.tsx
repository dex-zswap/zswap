import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Image } from 'zswap-uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'

const Wrap = styled(Flex)`
  align-items: center;
  justify-content: center;
  padding-top: 150px;
`
const TextWrap = styled.div`
  width: 560px;
  word-breal: break-word;
`

const ImgWrap = styled.div`
  width: 490px;
  position: relative;
  margin-left: 20px;
  > div {
    z-index: 99;
  }
`

const AbsoluteImg = styled.div`
  width: 647px;
  position: absolute;
  bottom: -110px;
  left: -60px;
  z-index: 66 !important;
`

const Carousel = () => {
  const { t } = useTranslation()

  return (
    <Wrap>
      <TextWrap>
        <Text lineHeight="52px" color="primary" fontSize="48px" bold>
          ZSwap
        </Text>
        <Text lineHeight="52px" color="text" fontSize="48px" marginTop="5px" bold>
          The Most Advanced Decentralized Platform in the Universe
        </Text>
        <Text color="text" fontSize="18px" margin="40px 0 30px">
          More advanced and more convenient, easily complete the cryptocurrency exchange and win high bonuses
        </Text>
        <ConnectWalletButton noIcon={true} />
      </TextWrap>
      <ImgWrap>
        <Image width={490} height={371} src="/images/home/obj_1.png" />
        <AbsoluteImg>
          <Image width={647} height={375} src="/images/home/obj_2.png" />
        </AbsoluteImg>
      </ImgWrap>
    </Wrap>
  )
}

export default Carousel
