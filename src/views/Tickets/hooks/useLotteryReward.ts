import { useMemo, useState, useEffect } from 'react'
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
  console.log(zbstPrice, zustValue.toFixed(2), lotteryId)
  return {
    zustValue,
    zbRewards,
  }
}

export function useAllRewards(lotteryIds: string[]) {
  const [rewardInfo, setRewardInfo] = useState({})
  const lotteryContract = useZSwapLotteryContract()
  const zbstPrice = useZBZUSTPrice()

  const prizeBigNumber = useMemo(() => {
    return zbstPrice ? new BigNumber(zbstPrice.toSignificant(18)) : BIG_ZERO
  }, [zbstPrice])

  useEffect(() => {
    const fetchRewards = async () => {
      const callQueue = lotteryIds.map((id) => lotteryContract.lottoTotalRewards(id))
      const results = await Promise.all(callQueue)
      const rewards = {}
      let zbstValue, zustValue

      if (results.length === lotteryIds.length) {
        results.forEach((reward, index) => {
          zbstValue = new BigNumber(reward.toString()).dividedBy(BIG_TEN.pow(18))
          zustValue = zbstValue.multipliedBy(prizeBigNumber)

          rewards[`lottery${lotteryIds[index]}`] = {
            zbstValue,
            zustValue,
          }
        })

        setRewardInfo(() => rewards)
      }
    }

    if (lotteryIds) {
      fetchRewards()
    }
  }, [lotteryIds, prizeBigNumber, lotteryContract])

  return rewardInfo
}
