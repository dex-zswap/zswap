import { useMemo, useCallback } from 'react'
import { useZSwapLotteryContract } from 'hooks/useContract'
import { useContractCall } from 'hooks/useContractCall'

export function useCollectReward() {
  const lotteryContract = useZSwapLotteryContract()

  const collectReward = useCallback(async () => {
    const tx = await lotteryContract.claimReward()
    const receipt = await tx.wait()

    return receipt.status
  }, [lotteryContract])

  return {
    collectReward
  }
}

export default function useUserPrize() {
  const lotteryContract = useZSwapLotteryContract()

}