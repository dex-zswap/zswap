import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg style={{ width: 'blue' == props.type ? '10px' : props.width }} viewBox="0 0 16 18" {...props}>
      <polyline
        style={{
          fill: 'none',
          stroke: 'blue' == props.type ? '#0050FF' : '#fff',
          strokeWidth: 1.891,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeMiterlimit: 10,
        }}
        points=" 7,1 15,9 7,17 "
      />
      <line
        style={{
          fill: 'none',
          stroke: 'blue' == props.type ? '#0050FF' : '#fff',
          strokeWidth: 1.891,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeMiterlimit: 10,
        }}
        x1="15"
        y1="9"
        x2="1"
        y2="9"
      />
    </Svg>
  )
}

export default Icon
