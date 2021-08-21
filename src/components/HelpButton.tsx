import React from 'react'
import styled from 'styled-components'
import { Text, Button, HelpIcon, Link } from 'zswap-uikit'
import { useTranslation } from 'contexts/Localization'

const ButtonText = styled(Text)`
  display: none;
  ${({ theme }) => theme.mediaQueries.xs} {
    display: block;
  }
`

const StyledLink = styled(Link)`
  margin-left: 20px;
  display: flex;
  justify-content: flex-end;

  &:hover {
    text-decoration: none;
  }
`

const HelpButton = () => {
  const { t } = useTranslation()
  return (
    <StyledLink external href="https://docs.pancakeswap.finance/syrup-pools/syrup-pool">
      <Button scale="medium" variant="secondary">
        {t('Learn More')}
        {/* <HelpIcon color="backgroundAlt" ml={[null, null, null, 0, '6px']} /> */}
      </Button>
    </StyledLink>
  )
}

export default HelpButton
