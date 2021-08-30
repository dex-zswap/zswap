import React from 'react'
import styled from 'styled-components'
import { Button } from 'zswap-uikit'

interface PercentageButtonProps {
  onClick: () => void
}

const StyledButton = styled(Button)`
  min-width: 80px;
  height: 36px;
  border-radius: 18px;
  background: #303030;
`

const PercentageButton: React.FC<PercentageButtonProps> = ({ children, onClick }) => {
  return (
    <StyledButton variant="tertiary" onClick={onClick}>
      {children}
    </StyledButton>
  )
}

export default PercentageButton
