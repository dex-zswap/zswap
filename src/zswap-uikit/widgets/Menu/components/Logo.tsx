import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { LogoIcon } from '../../../components/Svg'
import { Text } from 'zswap-uikit'
import Flex from '../../../components/Box/Flex'
import { HamburgerIcon, HamburgerCloseIcon, LogoIcon as LogoWithText } from '../icons'
import MenuButton from './MenuButton'

interface Props {
  isPushed: boolean
  isDark: boolean
  togglePush: () => void
  href: string
}

const blink = keyframes`
  0%,  100% { transform: scaleY(1); } 
  50% { transform:  scaleY(0.1); } 
`

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  .mobile-icon {
    width: 32px;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: none;
    }
  }
  .desktop-icon {
    width: 160px;
    display: none;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: block;
    }
  }
  .right-eye {
    animation-delay: 20ms;
  }
  &:hover {
    .left-eye,
    .right-eye {
      transform-origin: center 60%;
      animation-name: ${blink};
      animation-duration: 350ms;
      animation-iteration-count: 1;
    }
  }
`

const Logo: React.FC<Props> = ({ isPushed, togglePush, isDark, href }) => {
  const isAbsoluteUrl = href.startsWith('http')
  // const innerLogo = (
  //   <>
  //     <LogoIcon className="mobile-icon" />
  //     <LogoWithText className="desktop-icon" isDark={isDark} />
  //   </>
  // )

  const innerLogo = (
    <>
      <img width="32px" src="/images/logo.png" />
      <Text ml="10px" fontSize="20px" fontWeight="bold">
        ZSwap
      </Text>
    </>
  )

  return (
    <Flex>
      <MenuButton aria-label="Toggle menu" onClick={togglePush} mr="30px">
        {isPushed ? (
          <HamburgerCloseIcon width="24px" color="textSubtle" />
        ) : (
          <HamburgerIcon width="24px" color="textSubtle" />
        )}
      </MenuButton>
      {isAbsoluteUrl ? <StyledLink to={href}>{innerLogo}</StyledLink> : <StyledLink to={href}>{innerLogo}</StyledLink>}
    </Flex>
  )
}

export default React.memo(Logo, (prev, next) => prev.isPushed === next.isPushed && prev.isDark === next.isDark)
