import { ChainId, Currency, currencyEquals, JSBI, Price, WDEX } from 'zswap-sdk'
import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ZUSD, CAKE } from 'config/constants/tokens'
import { PairState, usePairs } from './usePairs'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { useZBCurrency, useZBSTCurrency } from 'hooks/Tokens'

/**
 * Returns the price in ZUSD of the input currency
 * @param currency currency to compute the ZUSD price of
 */
export default function useZUSDPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React()
  const ZUSD_MAINNET = ZUSD[chainId]
  const wrapped = wrappedCurrency(currency, chainId)
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [
        chainId && wrapped && currencyEquals(WDEX[chainId], wrapped) ? undefined : currency,
        chainId ? WDEX[chainId] : undefined,
      ],
      [wrapped?.equals(ZUSD_MAINNET) ? undefined : wrapped, ZUSD[chainId]],
      [chainId ? WDEX[chainId] : undefined, ZUSD[chainId]],
    ],
    [chainId, currency, wrapped],
  )
  const [[ethPairState, ethPair], [usdPairState, usdPair], [usdEthPairState, usdEthPair]] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }
    // handle weth/eth
    if (wrapped.equals(WDEX[chainId])) {
      if (usdPair) {
        const price = usdPair.priceOf(WDEX[chainId])
        return new Price(currency, ZUSD_MAINNET, price.denominator, price.numerator)
      }
      return undefined
    }
    // handle busd
    if (wrapped.equals(ZUSD_MAINNET)) {
      return new Price(ZUSD_MAINNET, ZUSD_MAINNET, '1', '1')
    }

    // all other tokens
    // first try the zusd pair
    if (usdPairState === PairState.EXISTS && usdPair) {
      const price = usdPair.priceOf(wrapped)
      return new Price(currency, ZUSD_MAINNET, price.denominator, price.numerator)
    }

    // calculate token price like Token -> DEX, DEX -> ZUST, transmit with DEX Token to calculate
    if (ethPairState === PairState.EXISTS && ethPair && usdEthPairState === PairState.EXISTS && usdEthPair) {
      if (usdEthPair.reserveOf(ZUSD_MAINNET).greaterThan('0') && ethPair.reserveOf(WDEX[chainId]).greaterThan('0')) {
        const ethusdPrice = usdEthPair.priceOf(ZUSD_MAINNET)
        const currencyEthPrice = ethPair.priceOf(WDEX[chainId])
        const usdPrice = ethusdPrice.multiply(currencyEthPrice).invert()
        return new Price(currency, ZUSD_MAINNET, usdPrice.denominator, usdPrice.numerator)
      }
    }
    return undefined
  }, [chainId, currency, ethPair, ethPairState, usdEthPair, usdEthPairState, usdPair, usdPairState, wrapped])
}

export function useZBZUSTPrice() {
  const currency = useZBCurrency()
  return useZUSDPrice(currency)
}

export function useZBSTZUSTPrice() {
  const currency = useZBSTCurrency()
  return useZUSDPrice(currency)
}

export const useCakeBusdPrice = (): Price | undefined => {
  const { chainId } = useActiveWeb3React()
  const currentChaindId = chainId || ChainId.MAINNET
  const cakeBusdPrice = useZUSDPrice(CAKE[currentChaindId])
  return cakeBusdPrice
}
