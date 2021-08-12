import React from 'react'
import Svg from '../../../components/Svg/Svg'
import { SvgProps } from '../../../components/Svg/types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 226.21 168.97" {...props}>
      <path
        d="M138.35,210.5a11.14,11.14,0,0,1-7.9-3.27L91.28,168.07a11.18,11.18,0,0,1,0-15.8l40.49-40.48a11.17,11.17,0,1,1,15.8,15.8L115,160.17l31.27,31.26a11.17,11.17,0,0,1-7.9,19.07"
        transform="translate(-88.01 -108.52)"
      />
      <path
        d="M226.26,170.68h-119a11.17,11.17,0,0,1,0-22.34h119a11.17,11.17,0,1,1,0,22.34"
        transform="translate(-88.01 -108.52)"
      />
      <path
        d="M262.57,277.49a11.17,11.17,0,0,1-7.9-19.06l32.59-32.59L256,194.58a11.17,11.17,0,1,1,15.79-15.8L311,217.94a11.18,11.18,0,0,1,0,15.8l-40.48,40.48a11.14,11.14,0,0,1-7.9,3.27"
        transform="translate(-88.01 -108.52)"
      />
      <path
        d="M294.09,237.67H176a11.17,11.17,0,1,1,0-22.34H294.09a11.17,11.17,0,1,1,0,22.34"
        transform="translate(-88.01 -108.52)"
      />
    </Svg>
  )
}

export default Icon
