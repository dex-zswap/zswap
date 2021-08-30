import { useMemo } from 'react'
import { useZSwapLPContract } from 'hooks/useContract'
import { useContractCalls } from 'hooks/useContractCall'

import AllLps from 'config/constants/zswap/lps'

type PairsInfo = {
  pair: string
  weight: number
  token0: string
  token1: string
}

type AllPairs = {
  loading: boolean
  pairs: Array<PairsInfo>
}

export function useAllPairs(): AllPairs {
  const lpContract = useZSwapLPContract()

  const allPairsWeightArgs = AllLps.map(({ pair }) => [pair])
  const allLPWeights = useContractCalls(lpContract, 'lp_weight', allPairsWeightArgs)

  return useMemo<AllPairs>(() => {
    const pairs = []
    allLPWeights.result.forEach((weight, idx) => {
      if (weight.gt(0)) {
        pairs.push({
          weight: weight.toNumber(),
          pair: AllLps[idx].pair,
          token0: AllLps[idx].token0,
          token1: AllLps[idx].token1,
        })
      }
    })

    return {
      loading: allLPWeights.result.length === 0 && allLPWeights.loading,
      pairs,
    }
  }, [allLPWeights])
}
