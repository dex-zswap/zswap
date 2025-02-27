import { useMemo, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'

import { useZSwapLotteryContract } from 'hooks/useContract'
import { useContractCall } from 'hooks/useContractCall'
import { useZBSTZUSTPrice } from 'hooks/useZUSDPrice'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'

export default function useLotteryReward(lotteryId: string | number) {
  const lotteryContract = useZSwapLotteryContract()
  const reward = useContractCall(lotteryContract, 'lottoTotalRewards', [lotteryId], false)
  const zbstPrice = useZBSTZUSTPrice()
  const zbRewards = reward.result
    ? new BigNumber(reward.result.toString()).dividedBy(BIG_TEN.pow(18)).dividedBy(0.8)
    : BIG_ZERO

  const zustValue = useMemo(() => {
    if (!zbstPrice) {
      return BIG_ZERO
    }

    return zbRewards.multipliedBy(new BigNumber(zbstPrice.toSignificant(18)))
  }, [zbstPrice, zbRewards])
  return {
    zustValue: BIG_ZERO == zustValue ? '$-' : `$${zustValue.toFixed(2)}`,
    zbRewards: BIG_ZERO == zbRewards ? '- ZBST' : `${zbRewards.toFixed(2)} ZBST`,
  }
}

export function useAllRewards(lotteryIds: string[]) {
  const [rewardInfo, setRewardInfo] = useState({})
  const lotteryContract = useZSwapLotteryContract()
  const zbstPrice = useZBSTZUSTPrice()

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
          zbstValue = new BigNumber(reward.toString()).dividedBy(BIG_TEN.pow(18)).dividedBy(0.8)
          zustValue = zbstValue.multipliedBy(prizeBigNumber)

          rewards[`lottery${lotteryIds[index]}`] = {
            zbstValue,
            zustValue,
          }
        })

        setRewardInfo(() => rewards)
      }
    }

    if (lotteryIds && lotteryIds?.length) {
      fetchRewards()
    }
  }, [lotteryIds, prizeBigNumber, lotteryContract])

  return rewardInfo
}
