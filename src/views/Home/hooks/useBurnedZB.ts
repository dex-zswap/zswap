import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useAllTokens } from 'hooks/Tokens'
import { useTokenBalances } from 'state/wallet/hooks'
import { useZSwapLPContract } from 'hooks/useContract'
import { useBlockNumber } from 'state/application/hooks'
import { ZSWAP_ZB_BURNED_ADDRESS } from 'config/constants/zswap/address'
import { useZBCurrency, useZBSTCurrency, useZBToken } from 'hooks/Tokens'
import { useContractCall } from 'hooks/useContractCall'
import { usePairs, usePair, PairState } from 'hooks/usePairs'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'

export default function useBurnedZB() {
  const tokenMap = useAllTokens()
  const zbCurrency = useZBCurrency()
  const zbstCurrency = useZBSTCurrency()
  const lpContract = useZSwapLPContract()
  const zbToken = useZBToken()
  const blockNumber = useBlockNumber()
  const allTokens = useMemo(() => Object.keys(tokenMap).map((address) => tokenMap[address]), [tokenMap])
  const tokenBalance = useTokenBalances(ZSWAP_ZB_BURNED_ADDRESS, allTokens)
  const otherTotalRewards = useContractCall(lpContract, 'getOtherTotalRewards', [blockNumber, 5], true)

  const [zbstzbPairState,  zbstzbPair] = usePair(zbstCurrency, zbCurrency)

  const allBalances = useMemo(() => {
    return Object.assign({}, tokenBalance)
  }, [tokenBalance])

  const allPairsCurrencies = useMemo(() => {
    if (!zbCurrency || !zbToken) {
      return []
    }
    return Object.keys(allBalances).map((key) => [zbCurrency, allBalances[key].currency])
  }, [allBalances, zbCurrency, zbToken])

  const allPaires = usePairs(allPairsCurrencies)

  return useMemo(() => {
    let zbBefore, token, zbPrice, amount
    let zbPriceValue = BIG_ZERO
    let totalBurned, feeAmount

    let total = allPaires.reduce((prev, [pairState, pair]) => {
      if (pairState === PairState.EXISTS) {
        zbBefore = pair.token0.equals(zbToken)
        token = zbBefore ? pair.token1 : pair.token0
        zbPrice = zbBefore ? pair.token1Price : pair.token0Price
        amount = allBalances[token.address]

        zbPriceValue = new BigNumber(amount.toExact())
          .multipliedBy(new BigNumber(zbPrice.toSignificant(18)))
      }

      return prev.plus(zbPriceValue)
    }, BIG_ZERO)

    totalBurned = total

    if (zbstzbPairState === PairState.EXISTS && otherTotalRewards.result) {
      zbBefore = zbstzbPair.token0.equals(zbToken)
      zbPrice = zbBefore ? zbstzbPair.token1Price : zbstzbPair.token0Price
      feeAmount = new BigNumber(otherTotalRewards.result.toString()).multipliedBy(new BigNumber(zbPrice.toSignificant(18))).dividedBy(BIG_TEN.pow(18))
      totalBurned = total.plus(feeAmount).integerValue(BigNumber.ROUND_HALF_UP)
    }

    return totalBurned
  }, [allPaires, allBalances, zbstzbPairState, zbstzbPair, otherTotalRewards])
}
