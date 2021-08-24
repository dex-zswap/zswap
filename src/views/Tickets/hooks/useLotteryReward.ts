import { useMemo } from 'react'
import BigNumber from 'bignumber.js'

import { useZSwapLotteryContract } from 'hooks/useContract'
import { useContractCall } from 'hooks/useContractCall'
import { useZBSTZUSTPrice } from 'hooks/useZUSDPrice'
import { BIG_ZERO } from 'utils/bigNumber'

export default function useLotteryReward(lotteryId: string) {
  const lotteryContract = useZSwapLotteryContract()
  const reward = useContractCall(lotteryContract, 'lottoTotalRewards', [lotteryId])
  const zbstPrice = useZBSTZUSTPrice()
  const zbRewards = reward.result ? new BigNumber(reward.result.toString()) : BIG_ZERO

  const zustValue = useMemo(() => {
    if (!zbstPrice) {
      return BIG_ZERO
    }

    return zbRewards.multipliedBy(new BigNumber(zbstPrice.toSignificant(18)))
  }, [zbstPrice, zbRewards])

  return {
    zustValue,
    zbRewards,
  }
}
