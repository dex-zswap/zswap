import { Currency, ETHER, Token } from 'zswap-sdk'
import { BinanceIcon } from 'zswap-uikit'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import useHttpLocations from 'hooks/useHttpLocations'
import { WrappedTokenInfo } from 'state/lists/hooks'
import getTokenLogoURL from 'utils/getTokenLogoURL'
import Logo from './Logo'
import DexLogo from './tokens/DEX.png'

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      // if (currency instanceof WrappedTokenInfo) {
      //   return [...uriLocations, getTokenLogoURL(currency.address)]
      // }
      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === ETHER) {
    return <img style={{ ...style }} width={size} src={DexLogo} />
  }
  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
