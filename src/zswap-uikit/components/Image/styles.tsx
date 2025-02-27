import styled from 'styled-components'
import { variant as StyledSystemVariant } from 'styled-system'
import { ImageProps, Variant, variants } from './types'
import TokenImage from './TokenImage'

interface StyledImageProps extends ImageProps {
  variant: Variant
}

export const StyledPrimaryImage = styled(TokenImage)<StyledImageProps>`
  width: ${({ variant }) =>
    variant === variants.DEFAULT ? '92%' : '82%'}; // 92, 82 are arbitrary numbers to fit the variant

  ${StyledSystemVariant({
    variants: {
      [variants.DEFAULT]: {
        bottom: 'auto',
        left: 0,
        right: 'auto',
        top: 0,
        zIndex: 5,
      },
      [variants.INVERTED]: {
        bottom: 0,
        left: 'auto',
        right: 0,
        top: 'auto',
        zIndex: 6,
      },
    },
  })}
`

export const StyledSecondaryImage = styled(TokenImage)<StyledImageProps>`
  width: 100%;
  > img {
    position: relative;
  }

  ${StyledSystemVariant({
    variants: {
      [variants.DEFAULT]: {
        bottom: 0,
        left: 'auto',
        right: 0,
        top: 'auto',
        zIndex: 6,
      },
      [variants.INVERTED]: {
        bottom: 'auto',
        left: 0,
        right: 'auto',
        top: 0,
        zIndex: 5,
      },
    },
  })}
`
