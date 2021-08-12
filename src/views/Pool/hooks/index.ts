import { useMemo } from 'react'
import { Interface } from '@ethersproject/abi'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { JSBI, Percent } from 'zswap-sdk'
import { useFactoryContract, usePairContracts } from 'hooks/useContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import {
  useSingleCallResult,
  useSingleContractMultipleData,
  useMultipleContractSingleData,
} from 'state/multicall/hooks'

import { ONE_HUNDRED_PERCENT } from 'config/constants'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

export function useUserPairs() {
  const { account } = useActiveWeb3React()
  const factoryContract = useFactoryContract()

  // const allPairsLength = useSingleCallResult(factoryContract, 'allPairsLength')
  // const pairsIndexArgs = useMemo<Array<Array<number>>>(() => {
  //   const indexs: Array<Array<number>> = []
  //   const { length } = allPairsLength.result ?? []
  //   for (let i = 0; i < length; i++) {
  //     indexs.push([i])
  //   }
  //   return indexs
  // }, [allPairsLength])

  // const allPairs = useSingleContractMultipleData(factoryContract, 'allPairs', pairsIndexArgs)
  // const allPairsIdArgs = useMemo(() => {
  //   return allPairs.map((pairResult) => pairResult.result?.[0] ?? null)
  // }, [allPairs])

  console.log(account)

  // const allBalanceOf = useMultipleContractSingleData(allPairsIdArgs, PAIR_INTERFACE, 'balanceOf', [account])
  // const allTotalSupply = useMultipleContractSingleData(allPairsIdArgs, PAIR_INTERFACE, 'totalSupply', [])
  // const allToken0 = useMultipleContractSingleData(allPairsIdArgs, PAIR_INTERFACE, 'token0', [])
  // const allToken1 = useMultipleContractSingleData(allPairsIdArgs, PAIR_INTERFACE, 'token1', [])

  // console.log(allBalanceOf, allPairs, allPairsLength)

  // const pairsToken = useMemo(() => {
  //   const tokens = []

  //   let totalSupply, token0, token1

  //   allBalanceOf.forEach(({ result: balanceOf }, idx) => {
  //     totalSupply = allTotalSupply[idx].result
  //     token0 = allToken0[0].result
  //     token1 = allToken1[0].result


  //     if (result && result.length > 0) {
  //       if (result.length && result[0].gte(0)) {
  //         tokens.push({
  //           balanceOf: new Percent(
  //             JSBI.BigInt(result[0].toNumber()),
  //             JSBI.BigInt(allTotalSupply[idx].result[0].toNumber()),
  //           ),
  //           token0: alltoken0[idx].result[0],
  //           token1: alltoken1[idx].result[0],
  //         })
  //       }
  //     }
  //   })

  //   return tokens
  // }, [allBalanceOf, allTotalSupply, allPairsIdArgs, allToken0, allToken1])

  // const pairContracts = usePairContracts(allPairsIdArgs)

  // const pairs = useSingleContractMultipleData(factoryContract, 'getPair', [['0x4Fba005c19b2f08Da85A29542311fFf0D6Cb1eA1']])

  // console.log(allTotalSupply, allBalanceOf)

  // const results = useMultipleContractSingleData(['0x1'], FACTORY_INTERFACE, 'allPairs')
  // console.log(results)

  return []
}
