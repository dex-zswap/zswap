import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useAllTokens } from 'hooks/Tokens'
import { useTokenBalances, useDEXBalances } from 'state/wallet/hooks'
import { ZSWAP_ZB_BURNED_ADDRESS, ZSWAP_WDEX_ADDRESS } from 'config/constants/zswap/address'
import { useZBCurrency, useZBToken } from 'hooks/Tokens'
import { usePairs, PairState } from 'hooks/usePairs'
import { BIG_ZERO } from 'utils/bigNumber'

export default function useBurnedZB() {
  const tokenMap = useAllTokens()
  const zbCurrency = useZBCurrency()
  const zbToken = useZBToken()
  const allTokens = useMemo(() => Object.keys(tokenMap).map((address) => tokenMap[address]), [tokenMap])
  const tokenBalance = useTokenBalances(ZSWAP_ZB_BURNED_ADDRESS, allTokens)
  const dexBalance = useDEXBalances([ZSWAP_ZB_BURNED_ADDRESS])

  const allBalances = useMemo(() => {
    return Object.assign({}, dexBalance, tokenBalance)
  }, [dexBalance, tokenBalance])

  const allPairsCurrencies = useMemo(() => {
    if (!zbCurrency || !zbToken) {
      return []
    }
    return Object.keys(allBalances).map((key) => [zbCurrency, allBalances[key].currency])
  }, [allBalances, zbCurrency, zbToken])

  const allPaires = usePairs(allPairsCurrencies)

  return useMemo(() => {
    return allPaires.reduce((prev, [pairState, pair]) => {
      let zbPriceValue = BIG_ZERO
      if (pairState === PairState.EXISTS) {
        const zbBefore = pair.token0.equals(zbToken)
        const token = zbBefore ? pair.token1 : pair.token0
        const isDex = token.address === ZSWAP_WDEX_ADDRESS
        const zbPrice = zbBefore ? pair.token1Price : pair.token0Price
        let amount = allBalances[token.address]

        if (!amount && isDex) {
          amount = allBalances[ZSWAP_ZB_BURNED_ADDRESS]
        }

        zbPriceValue = new BigNumber(amount.toExact())
          .multipliedBy(new BigNumber(zbPrice.toSignificant(18)))
          .integerValue()
      }

      return prev.plus(zbPriceValue)
    }, BIG_ZERO)
  }, [allPaires, allBalances])
}
