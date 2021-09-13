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
    @media screen and (max-width: 1650px) {
      display: none;
    }
  }
  .home_icon1 {
    left: 40px;
    top: 50px;
  }
  .home_icon2 {
    right: 90px;
    bottom: 23%;
  }
  .home_icon3 {
    right: 90px;
    bottom: 80px;
  }
  .home_icon4 {
    left: 50px;
    bottom: 26%;
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
  z-index: 0 !important;
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
  z-index: 0 !important;
`

const Home: React.FC = () => {
  return (
    <HomeWrap>
      <Carousel />
      <Banner />
      <Footer />
      <BlueBg />
      <PinkBg />
      <Image className="home_icon home_icon1" width={35} height={158} src="/images/home/obj_1.png" />
      <Image className="home_icon home_icon2" width={85} height={85} src="/images/home/obj_2.png" />
      <Image className="home_icon home_icon3" width={405} height={34} src="/images/home/obj_3.png" />
      <Image className="home_icon home_icon4" width={158} height={59} src="/images/home/obj_4.png" />
    </HomeWrap>
  )
}

export default Home
