import React from 'react'
import { TokenPairImageProps, variants } from './types'
import { StyledPrimaryImage, StyledSecondaryImage } from './styles'
import Wrapper from './Wrapper'

const TokenPairImage: React.FC<TokenPairImageProps> = ({
  secondarySrc,
  width,
  height,
  variant = variants.DEFAULT,
  secondaryImageProps = {},
  ...props
}) => {
  const secondaryImageSize = Math.floor(width)

  return (
    <Wrapper width={width} height={height} {...props}>
      {/* <StyledPrimaryImage variant={variant} src={primarySrc} width={width} height={height} {...primaryImageProps} /> */}
      <StyledSecondaryImage
        variant={variant}
        src={secondarySrc}
        width={secondaryImageSize}
        height={secondaryImageSize}
        {...secondaryImageProps}
      />
    </Wrapper>
  )
}

export default TokenPairImage
