import { useMemo } from 'react'

import { useZSwapLotteryContract } from 'hooks/useContract'
import { useContractCall } from 'hooks/useContractCall'

export default function useTimeRange() {
  const lotteryContract = useZSwapLotteryContract()
  const startTime = useContractCall(lotteryContract, 'startingTimestamp')
  const endTime = useContractCall(lotteryContract, 'closingTimestamp')

  return useMemo(() => {
    if (!startTime.result || !endTime.result) {
      return null
    }

    //  TODO: add timezone
    const start = startTime.result.toNumber() * 1000
    const end = endTime.result.toNumber() * 1000

    return {
      start,
      end,
    }
  }, [startTime, endTime])
}
