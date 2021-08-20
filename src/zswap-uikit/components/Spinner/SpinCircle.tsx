import React from 'react'
import Svg from '../Svg/Svg'
import { SvgProps } from '../Svg/types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 85 85" {...props}>
      <path
        fill="#0050FF"
        d="M42.5,84.9C19.1,84.9,0,65.8,0,42.4S19.1-0.1,42.5-0.1C65.9-0.1,85,19,85,42.4c0,1.4-1.1,2.5-2.5,2.5
	c-1.4,0-2.5-1.1-2.5-2.5C80,21.7,63.2,4.9,42.5,4.9C21.8,4.9,5,21.7,5,42.4c0,20.7,16.8,37.5,37.5,37.5c1.4,0,2.5,1.1,2.5,2.5
	C45,83.8,43.9,84.9,42.5,84.9"
      />
    </Svg>
  )
}

export default Icon
