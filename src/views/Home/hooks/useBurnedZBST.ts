import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useZSwapLPContract } from 'hooks/useContract'
import { useZBSTToken } from 'hooks/Tokens'
import { useBlockNumber } from 'state/application/hooks'
import { useContractCall } from 'hooks/useContractCall'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'

export default function useBurnedZBST() {
  const lpContract = useZSwapLPContract()
  const blockNumber = useBlockNumber()
  const zbst = useZBSTToken()
  const otherTotalRewards = useContractCall(lpContract, 'getOtherTotalRewards', [blockNumber, 15], true)

  return useMemo(() => {
    return (otherTotalRewards.result && zbst) ? new BigNumber(otherTotalRewards.result.toString()).div(BIG_TEN.pow(zbst.decimals)) : BIG_ZERO
  }, [otherTotalRewards, zbst])
}
