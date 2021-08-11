import React from 'react'
import Svg from '../../../components/Svg/Svg'
import { SvgProps } from '../../../components/Svg/types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 203.59 196.18" {...props}>
      <path
        d="M172.59,285.59H113.37a13,13,0,0,1-13-13V205.94a13,13,0,0,1,13-13h59.22a13,13,0,0,1,13,13v66.68a13,13,0,0,1-13,13m-46.25-25.94h33.28V218.91H126.34Z"
        transform="translate(-100.41 -89.41)"
      />
      <path
        d="M231.81,285.59H172.59a13,13,0,0,1-13-13V154a13,13,0,0,1,13-13h59.22a13,13,0,0,1,13,13V272.62a13,13,0,0,1-13,13m-46.26-25.94h33.29V166.92H185.55Z"
        transform="translate(-100.41 -89.41)"
      />
      <path
        d="M291,285.59H231.81a13,13,0,0,1-13-13V102.38a13,13,0,0,1,13-13H291a13,13,0,0,1,13,13V272.62a13,13,0,0,1-13,13m-46.25-25.94h33.29V115.35H244.78Z"
        transform="translate(-100.41 -89.41)"
      />
    </Svg>
  )
}

export default Icon
