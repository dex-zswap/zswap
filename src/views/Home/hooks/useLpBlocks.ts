import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useZSwapLPContract } from 'hooks/useContract'
import { useBlockNumber } from 'state/application/hooks'
import { useContractCall } from 'hooks/useContractCall'
import { BIG_ZERO } from 'utils/bigNumber'

export default function useLpBlocks() {
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

  return lpMinBlockNumber
}
