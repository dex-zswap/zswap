import { useMemo } from 'react'
import { Price } from 'zswap-sdk'

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { useToken } from 'hooks/Tokens'
import { useLPTokenBalance } from 'hooks/useTokenBalance'
import useZUSDPrice from 'hooks/useZUSDPrice'

type PairsInfo = {
  pair: string
  weight: number
  token0: string
  token1: string
}

export function usePairInfo(pair: PairsInfo): any {
  const { chainId } = useActiveWeb3React()

  const token0 = useToken(pair.token0)
  const token1 = useToken(pair.token1)

  const currency0USDTPrice = useZUSDPrice(token0)
  const currency1USDTPrice = useZUSDPrice(token1)

  const token0Amount = useLPTokenBalance(pair.token0, pair.pair)
  const token1Amount = useLPTokenBalance(pair.token1, pair.pair)

  const totalAmount = useMemo(() => {
    const total0Balance = token0Amount.balance?.div(Math.pow(1, token0.decimals))
    
  }, [token0, token1, token0Amount, token1Amount])

  console.log(token0Amount.balance?.integerValue())

  // return new Price(currencyAAmount.currency, currencyBAmount.currency, currencyAAmount.raw, currencyBAmount.raw)

  return {
    pid: 100,
    lpSymbol: `${token0.symbol}-${token1.symbol} LP`,
    apr: 1000,
    lpAddresses: {
      [chainId]: pair.pair
    },
    token: {
      symbol: token0.symbol,
      address: {
        [chainId]: token0.address
      },
      decimals: token0.decimals,
      projectLink: "https://pancakeswap.finance/"
    },
    quoteToken: {
      symbol: token1.symbol,
      address: {
        [chainId]: token1.address
      },
      decimals: token1.decimals,
      projectLink: "https://pancakeswap.finance/"
    }
  }
}


