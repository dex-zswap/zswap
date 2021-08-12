import React from 'react'
import Svg from '../../../components/Svg/Svg'
import { SvgProps } from '../../../components/Svg/types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 1024 1024" {...props}>
      <path
        d="M792.208 508.768l211.392-211.376a55.04 55.04 0 0 0-77.824-77.824L691.888 437.44H344.576L110.688 219.568a55.008 55.008 0 1 0-77.808 77.824l211.376 211.376L32.88 720.16a55.008 55.008 0 0 0 0 77.824 54.992 54.992 0 0 0 77.808 0l233.872-217.872h347.328L925.76 797.984a55.008 55.008 0 0 0 77.824 0 55.008 55.008 0 0 0 0-77.824L792.208 508.768z"
        p-id="45470"
      ></path>
    </Svg>
  )
}

export default Icon
