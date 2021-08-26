import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 1024 1024" {...props}>
      <path d="M584.704 182.784a42.666667 42.666667 0 1 0-59.861333 60.8L753.92 469.333333H170.666667a42.666667 42.666667 0 1 0 0 85.333334h583.04L524.8 780.16a42.666667 42.666667 0 1 0 59.861333 60.757333l295.466667-291.072a53.333333 53.333333 0 0 0 0-75.946666l-295.466667-291.114667z" />
    </Svg>
  )
}

export default Icon
