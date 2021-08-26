import { useCallback, useState } from 'react'
import { useZSwapLotteryContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'

export function useCollectReward() {
  const [ collecting, setCollecting ] = useState(false)
  const lotteryContract = useZSwapLotteryContract()
  const { toastSuccess, toastError } = useToast()

  const collectReward = useCallback(async () => {
    try {
      setCollecting(true)
      const tx = await lotteryContract.claimReward()
      const receipt = await tx.wait()
      setCollecting(false)
      if (receipt.status) {
        toastSuccess(
          'Success Collected',
          'You have success collected your ticket prizes'
        )
      } else {
        toastError('Collect Failed', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
      }
    } catch (e) {
      setCollecting(false)
      toastError('Collect Failed', 'Please try again. Confirm the transaction and make sure you are paying enough gas!')
    }
  }, [lotteryContract, toastError, toastSuccess])

  return {
    collectReward,
    collecting
  }
}

