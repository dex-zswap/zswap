import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from 'zswap-uikit'
import { useTranslation } from 'contexts/Localization'

const StyledNav = styled.nav`
  margin-bottom: 40px;
`

const getActiveIndex = (pathname: string): number => {
  if (
    pathname.includes('/pool') ||
    pathname.includes('/create') ||
    pathname.includes('/add') ||
    pathname.includes('/remove') ||
    pathname.includes('/find') ||
    pathname.includes('/liquidity')
  ) {
    return 1
  }
  return 0
}

const Nav = () => {
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <StyledNav>
      <ButtonMenu
        activeIndex={getActiveIndex(location.pathname)}
        scale="sm"
        variant="subtle"
        width="260px"
        height="50px"
      >
        <ButtonMenuItem id="swap-nav-link" to="/swap" as={Link}>
          {t('Exchange')}
        </ButtonMenuItem>
        <ButtonMenuItem id="pool-nav-link" to="/liquidity" as={Link}>
          {t('Liquidity')}
        </ButtonMenuItem>
      </ButtonMenu>
    </StyledNav>
  )
}

export default Nav
