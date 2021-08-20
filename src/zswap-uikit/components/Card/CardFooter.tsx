import styled from 'styled-components'
import { space, SpaceProps } from 'styled-system'

export type CardFooterProps = SpaceProps

const CardFooter = styled.div<CardFooterProps>`
  ${space}
`

CardFooter.defaultProps = {
  p: '0 24px 24px 24px',
}

export default CardFooter
