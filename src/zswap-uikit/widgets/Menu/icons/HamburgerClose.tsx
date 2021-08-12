import React from 'react'
import Svg from '../../../components/Svg/Svg'
import { SvgProps } from '../../../components/Svg/types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 200 200" {...props}>
      <path
        d="M24.2,46.9h151.7c4.2,0,7.6-3.4,7.6-7.6s-3.4-7.6-7.6-7.6H24.2c-4.2,0-7.6,3.4-7.6,7.6S20,46.9,24.2,46.9z M183.7,99.8
	c0-4.2-3.4-7.6-7.6-7.6H82.8c-4.2,0-7.6,3.4-7.6,7.6c0,4.2,3.4,7.6,7.6,7.6h93.3C180.3,107.4,183.7,104,183.7,99.8z M175.9,153H24.2
	c-4.2,0-7.6,3.4-7.6,7.6s3.4,7.6,7.6,7.6h151.7c4.2,0,7.6-3.4,7.6-7.6S180.1,153,175.9,153z M54.5,62L16.6,99.9l37.9,37.9V62z"
      />
    </Svg>
  )
}

export default Icon
