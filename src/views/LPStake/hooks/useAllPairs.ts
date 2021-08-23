import { useMemo } from 'react'
import { Interface } from '@ethersproject/abi'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { useFactoryContract, useZSwapLPContract } from 'hooks/useContract'
import { useSingleContractMultipleData, useMultipleContractSingleData } from 'state/multicall/hooks'
import { useContractCall } from 'hooks/useContractCall'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

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
  const factoryContract = useFactoryContract()
  const lpContract = useZSwapLPContract()

  const allPairsLength = useContractCall(factoryContract, 'allPairsLength')

  const pairsIndexArgs = useMemo<Array<Array<number>>>(() => {
    const indexs: Array<Array<number>> = []
    const length = allPairsLength.result ? allPairsLength.result.toNumber() : 0
    for (let i = 0; i < length; i++) {
      indexs.push([i])
    }
    return indexs
  }, [allPairsLength])

  const allPairs = useSingleContractMultipleData(factoryContract, 'allPairs', pairsIndexArgs)
  const allPairsIdArgs = useMemo(() => {
    return allPairs.map((pairResult) => pairResult.result?.[0] ?? undefined)
  }, [allPairs])
  const allPairsWeightArgs = useMemo(() => {
    const ids = []
    allPairs.forEach(({ result, loading }) => {
      if (!loading) {
        ids.push(result)
      }
    })
    return ids
  }, [allPairs])

  const allToken0 = useMultipleContractSingleData(allPairsIdArgs, PAIR_INTERFACE, 'token0', [])
  const allToken1 = useMultipleContractSingleData(allPairsIdArgs, PAIR_INTERFACE, 'token1', [])

  const allLPWeights = useSingleContractMultipleData(lpContract, 'lp_weight', allPairsWeightArgs)

  const loading: boolean = useMemo<boolean>(
    () => [allPairs, allToken0, allToken1, allLPWeights].flat().some(({ loading }) => loading),
    [allPairs, allToken0, allToken1, allLPWeights],
  )

  return useMemo<AllPairs>(() => {
    const pairs = []
    let token0, token1, weight

    if (!loading) {
      allPairsIdArgs.forEach((id, idx) => {
        weight = allLPWeights[idx].result
        token0 = allToken0[idx].result ?? []
        token1 = allToken1[idx].result ?? []

        if (weight[0].gt(0)) {
          pairs.push({
            pair: id,
            weight: weight[0].toNumber(),
            token0: token0[0],
            token1: token1[0],
          })
        }
      })
    }

    return {
      loading,
      pairs,
    }
  }, [allPairsIdArgs, allToken0, allToken1, allLPWeights])
}