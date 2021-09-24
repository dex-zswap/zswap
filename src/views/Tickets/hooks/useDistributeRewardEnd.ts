import { useMemo } from 'react'
import { useContractCall } from 'hooks/useContractCall'
import { useZSwapLotteryContract } from 'hooks/useContract'

import { useCurrentLotteryId } from './useBuy'

export default function useDistributeRewardEnd() {
  const lotteryId = useCurrentLotteryId()
  const lotteryContract = useZSwapLotteryContract()
  const distributeRewardEnd = useContractCall(lotteryContract, 'distributeRewardsEnd', [], true)

  return useMemo(() => {
    if (!lotteryId) {
      return !false
    }

    if (lotteryId > 1) {
      return distributeRewardEnd.result
    }
  }, [distributeRewardEnd, lotteryId])
}
