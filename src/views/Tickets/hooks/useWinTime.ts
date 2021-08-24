import BigNumber from 'bignumber.js'
import { useZSwapLotteryContract } from 'hooks/useContract'
import { useContractCall } from 'hooks/useContractCall'
import { BIG_ZERO } from 'utils/bigNumber'

export default function useWinTime(lotteryId: string) {
  const lotteryContract = useZSwapLotteryContract()
  const winTime = useContractCall(lotteryContract, 'lottoWinningTime', [lotteryId])

  return winTime.result ? new BigNumber(winTime.result.toString()).multipliedBy(1000) : BIG_ZERO
}
