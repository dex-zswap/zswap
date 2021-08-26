import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 1024 1024" {...props}>
      <path d="M439.253333 841.216a42.666667 42.666667 0 0 0 59.904-60.8L270.08 554.666667h583.253333a42.666667 42.666667 0 1 0 0-85.333334H270.336L499.2 243.84a42.666667 42.666667 0 0 0-59.904-60.8l-295.424 291.114667a53.333333 53.333333 0 0 0 0 75.946666l295.424 291.114667z" />
    </Svg>
  )
}

export default Icon
