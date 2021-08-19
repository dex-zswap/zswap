import styled, { css, keyframes } from 'styled-components'
import { Card, Box } from 'zswap-uikit'

const PromotedGradient = keyframes`
  0% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 50% 0%;
  }
`

interface PromotedStyleCardProps {
  isDesktop: boolean
}

export const StyledCard = styled(Card)<{
  isPromoted?: PromotedStyleCardProps
  isFinished?: boolean
}>`
  max-width: 360px;
  margin: 0 8px 24px;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  position: relative;
  background: #292929;
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled' : 'secondary']};
  box-shadow: 0px 0px 32px 0px rgba(19, 53, 93, 0.51);
  border-radius: 30px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0 12px 46px;
  }
`

export const StyledCardInner = styled(Box)`
  background: #292929;
  border-radius: 30px;
`

export default StyledCard
