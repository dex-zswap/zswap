import { useCallback, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useContractCall } from 'hooks/useContractCall'
import { useZSwapLotteryContract } from 'hooks/useContract'

export default function useBuy() {
  const lotteryContract = useZSwapLotteryContract()

  const buyTickets = useCallback(async() => {}, [lotteryContract])

  return {
    buyTickets
  }
}

export function useCurrentLotteryId() {
  const lotteryContract = useZSwapLotteryContract()
  const lotteryId = useContractCall(lotteryContract, 'lotteryId', [])
  
  return useMemo(() => {
    if (!lotteryId.result) {
      return '1'
    }

    return new BigNumber(lotteryId.result.toString()).toString()
  }, [lotteryId])
}