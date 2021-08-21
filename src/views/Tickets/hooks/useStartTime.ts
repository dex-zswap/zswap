import { useMemo } from 'react'
import dayjs from 'dayjs'

import { useZSwapLotteryContract } from 'hooks/useContract'
import { useContractCall } from 'hooks/useContractCall'

export default function useStartTime() {
  const lotteryContract = useZSwapLotteryContract()
  const startTime = useContractCall(lotteryContract, 'startingTimestamp')

  return useMemo(() => {
    if (!startTime.result) {
      return null
    }

    const timestamp = startTime.result.toNumber() * 1000

    return {
      timestamp,
      date: dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
    }
  }, [startTime])
}