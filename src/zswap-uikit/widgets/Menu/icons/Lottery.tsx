import React from 'react'
import Svg from '../../../components/Svg/Svg'
import { SvgProps } from '../../../components/Svg/types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 211.6 124.07" {...props}>
      <path
        d="M295.35,249.1H104.65A10.45,10.45,0,0,1,94.2,238.65V135.48A10.45,10.45,0,0,1,104.65,125h190.7a10.44,10.44,0,0,1,10.45,10.45V168.6a10.44,10.44,0,0,1-10.45,10.45c-6.55,0-11.3,3.37-11.3,8s4.86,8,11.3,8a10.44,10.44,0,0,1,10.45,10.45v33.12a10.45,10.45,0,0,1-10.45,10.45M115.1,228.2H284.9V214.47c-12.77-3.81-21.75-14.49-21.75-27.4,0-13.18,8.84-23.76,21.75-27.48V145.92H115.1Z"
        transform="translate(-94.2 -125.03)"
      />
      <path
        d="M215.44,204.25a10.45,10.45,0,1,1,10.45,10.44,10.45,10.45,0,0,1-10.45-10.44m0-34.36a10.45,10.45,0,1,1,10.45,10.45,10.45,10.45,0,0,1-10.45-10.45"
        transform="translate(-94.2 -125.03)"
      />
    </Svg>
  )
}

export default Icon
