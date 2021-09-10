import { Currency, ETHER, Token } from 'zswap-sdk'
import { useTokenLists } from 'state/lists/hooks'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import Logo from './Logo'
import DexLogo from 'components/Logo/tokens/DEX.png'
import ZbstLogo from 'components/Logo/tokens/ZBST.png'

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
  const tokenList = useTokenLists()

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []
    if (currency instanceof Token) {
      return [tokenList.filter(({ symbol }) => currency.symbol == symbol)[0]?.logoURI ?? '']
    }
    return []
  }, [currency])

  if (currency === ETHER) {
    return <img style={{ ...style }} width={size} src={DexLogo} />
  }

  if (currency.symbol === 'ZBST') {
    return <img style={{ ...style }} width={size} src={ZbstLogo} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
