import React from 'react'
import styled from 'styled-components'
import { Image } from 'zswap-uikit'
import Carousel from './components/Carousel'
import Banner from './components/Banner'
import Footer from './components/Footer'

export const HomeWrap = styled.div`
  position: relative;
  padding-bottom: 150px;
  > div {
    position: relative;
    z-index: 99;
  }
  .home_icon {
    position: absolute !important;
  }
`

const BlueBg = styled.div`
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: #0050fe;
  filter: blur(300px);
  position: absolute !important;
  left: 0;
  bottom: 0;
  z-index: 66 !important;
`

const PinkBg = styled.div`
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: #f866ff;
  filter: blur(200px);
  position: absolute !important;
  right: 0;
  bottom: 0;
  z-index: 66 !important;
`

const Home: React.FC = () => {
  return (
    <HomeWrap>
      <Carousel />
      <Banner />
      <Footer />
      <BlueBg />
      <PinkBg />
      {/* <Image className="home_icon home_icon-top" width={47} height={46} src="/images/home/banner/obj_4_1.png" />
      <Image className="home_icon home_icon-bottom" width={47} height={46} src="/images/home/banner/obj_4_1.png" /> */}
    </HomeWrap>
  )
}

export default Home
