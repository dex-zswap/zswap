import BigNumber from 'bignumber.js'
import { useZSwapLotteryContract } from 'hooks/useContract'
import { useContractCall } from 'hooks/useContractCall'
import { format } from 'date-fns'

export default function useWinTime(lotteryId: string) {
  const lotteryContract = useZSwapLotteryContract()
  const data = useContractCall(lotteryContract, 'lottoWinningTime', [lotteryId])
  const winTime = data.result ? new BigNumber(data.result.toString()).multipliedBy(1000).toNumber() : 0

  return winTime ? format(new Date(winTime), 'yyyy.MM.dd HH:mm') : '-'
}
