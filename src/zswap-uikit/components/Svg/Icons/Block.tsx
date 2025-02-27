import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 18 16.1" {...props}>
      <path
        d="M16.2,16.1H1.8c-0.6,0-1.2-0.3-1.6-0.9c-0.3-0.6-0.3-1.2,0-1.8L7.4,0.9l0,0C7.8,0.3,8.4,0,9,0h0
	c0.6,0,1.2,0.3,1.6,0.9l7.2,12.5c0.3,0.6,0.3,1.2,0,1.8C17.4,15.7,16.9,16.1,16.2,16.1 M2.1,14.1h13.7L9,2.2L2.1,14.1z"
      />
      <path d="M9,10.2c-0.6,0-1-0.4-1-1V6.4c0-0.6,0.4-1,1-1c0.6,0,1,0.4,1,1v2.8C10,9.8,9.6,10.2,9,10.2" />
      <path
        d="M9,13c-0.1,0-0.1,0-0.2,0c-0.1,0-0.1,0-0.2-0.1c-0.1,0-0.1-0.1-0.2-0.1c-0.1,0-0.1-0.1-0.2-0.1
	c0,0-0.1-0.1-0.1-0.2c0-0.1-0.1-0.1-0.1-0.2c0-0.1,0-0.1-0.1-0.2C8,12.1,8,12,8,12c0-0.1,0-0.1,0-0.2c0-0.1,0-0.1,0.1-0.2
	c0-0.1,0.1-0.1,0.1-0.2c0,0,0.1-0.1,0.1-0.1c0.4-0.4,1-0.4,1.4,0c0,0,0.1,0.1,0.1,0.1c0,0.1,0.1,0.1,0.1,0.2c0,0.1,0,0.1,0.1,0.2
	c0,0.1,0,0.1,0,0.2c0,0.1,0,0.1,0,0.2s0,0.1-0.1,0.2c0,0.1-0.1,0.1-0.1,0.2c0,0.1-0.1,0.1-0.1,0.2c0,0-0.1,0.1-0.2,0.1
	c-0.1,0-0.1,0.1-0.2,0.1c-0.1,0-0.1,0-0.2,0.1C9.1,13,9.1,13,9,13"
      />
    </Svg>
  )
}

export default Icon
