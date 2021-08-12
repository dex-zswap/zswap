import React from 'react'
import Svg from '../../../components/Svg/Svg'
import { SvgProps } from '../../../components/Svg/types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 181.12 165.3" {...props}>
      <path
        d="M224,262a61.3,61.3,0,0,1-44.39-18.81,10.53,10.53,0,0,1,15.13-14.65,40.71,40.71,0,0,0,70-28.31,40.94,40.94,0,0,0-29.15-39,10.53,10.53,0,0,1,6-20.2A61.78,61.78,0,0,1,224,262"
        transform="translate(-104.64 -96.7)"
      />
      <path
        d="M222.56,210.76H115.18A10.53,10.53,0,0,1,106.05,195l53.7-93A10.53,10.53,0,0,1,178,102l53.69,93a10.53,10.53,0,0,1-9.12,15.79M133.41,189.7h70.91l-35.45-61.41Z"
        transform="translate(-104.64 -96.7)"
      />
    </Svg>
  )
}

export default Icon
