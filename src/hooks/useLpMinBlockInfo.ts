import { useMemo, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { useBlockNumber } from 'state/application/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { useZSwapLPContract } from './useContract'
import useActiveWeb3React from './useActiveWeb3React'
import { useContractCall } from './useContractCall'

export default function useLpMinBlockInfo() {
  const [blockTime, setBlockTime] = useState(0)
  const { library } = useActiveWeb3React()
  const lpContract = useZSwapLPContract()
  const blockNumber = useBlockNumber()
  const lpBlockNumber = useContractCall(lpContract, 'OtherRewardsstartBlockNum', [], true)

  const lpMinBlockNumber = useMemo(() => {
    return (
      lpBlockNumber.result && blockNumber
        ? new BigNumber(blockNumber).minus(new BigNumber(lpBlockNumber.result.toString()))
        : BIG_ZERO
    ).toNumber()
  }, [lpBlockNumber, blockNumber])

  useEffect(() => {
    const fetchBlock = () => {
      library.getBlock(lpMinBlockNumber).then((response) => {
        setBlockTime(response.timestamp * 1000)
      })
    }

    if (lpMinBlockNumber > 0) {
      fetchBlock()
    }
  }, [library, lpMinBlockNumber])

  console.group('block number info')
  console.log('lp block:', lpMinBlockNumber)
  console.log('current block:', blockNumber)
  console.groupEnd()

  return {
    blockTime,
    blockNumber: lpMinBlockNumber,
  }
}
