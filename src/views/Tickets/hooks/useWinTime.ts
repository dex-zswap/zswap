import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useZSwapLotteryContract } from 'hooks/useContract'
import { useContractCall } from 'hooks/useContractCall'
import { useCurrentLotteryId } from 'views/Tickets/hooks/useBuy'
import { format } from 'date-fns'

export default function useWinTime(lotteryId: string | number) {
  const lotteryContract = useZSwapLotteryContract()
  const data = useContractCall(lotteryContract, 'lottoWinningTime', [lotteryId])
  const winTime = data.result ? new BigNumber(data.result.toString()).multipliedBy(1000).toNumber() : 0

  return winTime ? format(new Date(winTime), 'yyyy.MM.dd HH:mm') : '-'
}

export function useHasOpened(lotteryId?: string | number) {
  const [opened, setOpened] = useState(false)
  const lotteryContract = useZSwapLotteryContract()
  const currentLotteryId = useCurrentLotteryId()

  useEffect(() => {
    const fetch = async () => {
      const res = await lotteryContract.lottoWinningTime(lotteryId || currentLotteryId)
      if (res) {
        setOpened(res.gt(0))
      }
    }

    if (lotteryId) {
      fetch()
    }
  }, [lotteryId, lotteryContract])

  return opened
}
