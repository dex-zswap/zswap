import { useMemo } from 'react'
import { Interface } from '@ethersproject/abi'
import { useZSwapLPContract } from 'hooks/useContract'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import {
  useSingleCallResult,
  useSingleContractMultipleData,
  useMultipleContractSingleData,
} from 'state/multicall/hooks'

import { useAllPairs } from 'views/Pool/hooks'

import { LP_ADDRESSES } from 'config/constants/lpAddress'

export function useLPPairs() {
  const { account } = useActiveWeb3React()
  const allPairs = useAllPairs()
  const zSwapLpContract = useZSwapLPContract()

  const allLpPairIds = useMemo(() => {
    return allPairs.map(({ pair }) => [pair])
  }, [allPairs])

  // const allToken0 = useMultipleContractSingleData(allLpPairIds, zSwapLpContract.interface, 'lp_weight', [])
  // console.log(allPairs)
}
