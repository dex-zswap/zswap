import { useMemo } from 'react'
import { Interface } from '@ethersproject/abi'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { useFactoryContract } from 'hooks/useContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import {
  useSingleContractMultipleData,
  useMultipleContractSingleData,
} from 'state/multicall/hooks'
import { useContractCall } from 'hooks/useContractCall'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

type PairsInfo = {
  pair: string
  token0: string
  token1: string
}

type UserPairs = {
  loading: boolean
  pairs: Array<PairsInfo>
}

export function useUserPairs(): UserPairs {
  const { account } = useActiveWeb3React()
  const factoryContract = useFactoryContract()

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
    return allPairs.map((pairResult) => pairResult.result?.[0] ?? null)
  }, [allPairs])

  const allBalanceOf = useMultipleContractSingleData(allPairsIdArgs, PAIR_INTERFACE, 'balanceOf', [account])
  const allToken0 = useMultipleContractSingleData(allPairsIdArgs, PAIR_INTERFACE, 'token0', [])
  const allToken1 = useMultipleContractSingleData(allPairsIdArgs, PAIR_INTERFACE, 'token1', [])

  const loading: boolean = useMemo<boolean>(
    () => [allPairs, allBalanceOf, allToken0, allToken1].flat().some(({ loading }) => loading),
    [allPairs, allBalanceOf, allToken0, allToken1],
  )

  return useMemo<UserPairs>(() => {
    const pairs = []
    let token0, token1

    allBalanceOf.forEach(({ result: balanceOf = [] }, idx) => {
      token0 = allToken0[idx].result ?? []
      token1 = allToken1[idx].result ?? []

      if (!loading) {
        if (!balanceOf[0].eq(0)) {
          pairs.push({
            pair: allPairsIdArgs[idx],
            token0: token0[0],
            token1: token1[0],
          })
        }
      }
    })

    return {
      loading,
      pairs,
    }
  }, [allBalanceOf, allPairsIdArgs, allToken0, allToken1, loading])
}
