import React from 'react'
import Svg from '../../../components/Svg/Svg'
import { SvgProps } from '../../../components/Svg/types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 203.59 195.11" {...props}>
      <path
        d="M289.38,207.46a12.39,12.39,0,0,1-8.87-3.72L200,121.54l-80.51,82.2a12.42,12.42,0,0,1-17.74-17.38l89.38-91.25a12.77,12.77,0,0,1,17.74,0l89.38,91.25a12.41,12.41,0,0,1-8.87,21.1"
        transform="translate(-98.2 -91.53)"
      />
      <path
        d="M261.4,286.63H138.6a12.4,12.4,0,0,1-12.41-12.41V219.49a12.42,12.42,0,1,1,24.83,0V261.8h98V219.49a12.42,12.42,0,1,1,24.83,0v54.73a12.41,12.41,0,0,1-12.42,12.41"
        transform="translate(-98.2 -91.53)"
      />
    </Svg>
  )
}

export default Icon
