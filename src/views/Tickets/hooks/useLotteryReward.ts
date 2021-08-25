import { useMemo } from 'react'
import BigNumber from 'bignumber.js'

import { useZSwapLotteryContract } from 'hooks/useContract'
import { useContractCall } from 'hooks/useContractCall'
import { useZBZUSTPrice } from 'hooks/useZUSDPrice'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'

export default function useLotteryReward(lotteryId: string | number) {
  const lotteryContract = useZSwapLotteryContract()
  const reward = useContractCall(lotteryContract, 'lottoTotalRewards', [lotteryId])
  const zbstPrice = useZBZUSTPrice()
  const zbRewards = reward.result ? new BigNumber(reward.result.toString()).dividedBy(BIG_TEN.pow(18)) : BIG_ZERO

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
