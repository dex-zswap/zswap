import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { Interface } from '@ethersproject/abi'
import { TokenAmount, Pair, Currency } from 'zswap-sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ZSWAP_DEX_ADDRESS } from 'config/constants/zswap/address'
import { BIG_ZERO } from 'utils/bigNumber'
import { useMultipleContractSingleData } from 'state/multicall/hooks'
import { wrappedCurrency } from 'utils/wrappedCurrency'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

const SCALE_RATE = new BigNumber(1.00001)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React()

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ]),
    [chainId, currencies],
  )

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined
      }),
    [tokens],
  )

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]

      if (loading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      const token0IsDex = token0.address === ZSWAP_DEX_ADDRESS
      const token1IsDex = token1.address === ZSWAP_DEX_ADDRESS
      const isDEXPair = token0IsDex || token1IsDex
      if (isDEXPair) {
        let token0Reverse = new BigNumber(reserve0.toString())
        let token1Reverse = new BigNumber(reserve1.toString())

        if (token0IsDex && token1Reverse.gt(BIG_ZERO)) {
          token1Reverse = token1Reverse.multipliedBy(SCALE_RATE)
        }

        if (token1IsDex && token0Reverse.gt(BIG_ZERO)) {
          token0Reverse = token0Reverse.multipliedBy(SCALE_RATE)
        }

        return [
          PairState.EXISTS,
          new Pair(
            new TokenAmount(token0, token0Reverse.integerValue(BigNumber.ROUND_DOWN).toString()),
            new TokenAmount(token1, token1Reverse.integerValue(BigNumber.ROUND_DOWN).toString()),
          ),
        ]
      }
      return [
        PairState.EXISTS,
        new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString())),
      ]
    })
  }, [results, tokens])
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  return usePairs([[tokenA, tokenB]])[0]
}
