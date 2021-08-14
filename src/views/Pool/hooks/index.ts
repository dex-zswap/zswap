import { useMemo } from 'react'
import { Interface } from '@ethersproject/abi'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { useFactoryContract } from 'hooks/useContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import {
  useSingleCallResult,
  useSingleContractMultipleData,
  useMultipleContractSingleData,
} from 'state/multicall/hooks'

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

  const allPairsLength = useSingleCallResult(factoryContract, 'allPairsLength')
  const pairsIndexArgs = useMemo<Array<Array<number>>>(() => {
    const indexs: Array<Array<number>> = []
    const length = allPairsLength.result ? allPairsLength.result[0].toNumber() : 0
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
  const allTotalSupply = useMultipleContractSingleData(allPairsIdArgs, PAIR_INTERFACE, 'totalSupply', [])
  const allToken0 = useMultipleContractSingleData(allPairsIdArgs, PAIR_INTERFACE, 'token0', [])
  const allToken1 = useMultipleContractSingleData(allPairsIdArgs, PAIR_INTERFACE, 'token1', [])

  const loading: boolean = useMemo<boolean>(
    () => [allPairs, allBalanceOf, allToken0, allToken1].flat().some(({ loading }) => loading),
    [allPairs, allBalanceOf, allToken0, allToken1],
  )

  return useMemo<UserPairs>(() => {
    const pairs = []
    const totalSupply = allTotalSupply.length ? allTotalSupply[0].result : []

    let token0, token1

    allBalanceOf.forEach(({ result: balanceOf = [] }, idx) => {
      token0 = allToken0[idx].result ?? []
      token1 = allToken1[idx].result ?? []

      if (
        Boolean(balanceOf.length) &&
        Boolean(totalSupply.length) &&
        Boolean(token0.length) &&
        Boolean(token1.length)
      ) {
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
  }, [allBalanceOf, allTotalSupply, allPairsIdArgs, allToken0, allToken1, loading])
}


export function useAllPairs(): Array<PairsInfo> {
  const { account } = useActiveWeb3React()
  const factoryContract = useFactoryContract()

  const allPairsLength = useSingleCallResult(factoryContract, 'allPairsLength')
  const pairsIndexArgs = useMemo<Array<Array<number>>>(() => {
    const indexs: Array<Array<number>> = []
    const length = allPairsLength.result ? allPairsLength.result[0].toNumber() : 0
    for (let i = 0; i < length; i++) {
      indexs.push([i])
    }
    return indexs
  }, [allPairsLength])

  const allPairs = useSingleContractMultipleData(factoryContract, 'allPairs', pairsIndexArgs)
  const allPairsIdArgs = useMemo(() => {
    return allPairs.map((pairResult) => pairResult.result?.[0] ?? null)
  }, [allPairs])

  const allToken0 = useMultipleContractSingleData(allPairsIdArgs, PAIR_INTERFACE, 'token0', [])
  const allToken1 = useMultipleContractSingleData(allPairsIdArgs, PAIR_INTERFACE, 'token1', [])

  return useMemo<Array<PairsInfo>>(() => {
    const pairs = []
    let token0, token1

    allPairsIdArgs.forEach((id, idx) => {
      token0 = allToken0[idx].result ?? []
      token1 = allToken1[idx].result ?? []
      pairs.push({
        pair: id,
        token0: token0[0],
        token1: token1[0],
      })
    })

    return pairs
  }, [allPairsIdArgs, allToken0, allToken1])
}
