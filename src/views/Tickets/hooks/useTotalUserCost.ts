import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useZSwapLotteryContract } from 'hooks/useContract'
import { useContractCall } from 'hooks/useContractCall'
import { useZBSTToken } from 'hooks/Tokens'
import { useZBSTZUSTPrice } from 'hooks/useZUSDPrice'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'

export default function useTotalUserCost() {
  const lotteryContract = useZSwapLotteryContract()
  const zbst = useZBSTToken()
  const zbstPrice = useZBSTZUSTPrice()

  const lotteryReward = useContractCall(lotteryContract, 'totalUsersCost', [])

  return useMemo(() => {
    if (!lotteryReward.result || !zbstPrice || !zbst) {
      return {
        zusd: BIG_ZERO.toString(),
        zbst: BIG_ZERO.toString()
      }
    }

    const lotteryRewardBigNumber = new BigNumber(lotteryReward.result.toString()).dividedBy(BIG_TEN.pow(zbst.decimals))
    const priceBigNumber = new BigNumber(zbstPrice.toSignificant(6))

    return {
      zusd: lotteryRewardBigNumber.multipliedBy(priceBigNumber).toFixed(2),
      zbst: lotteryRewardBigNumber.toFixed(2)
    }
  }, [lotteryReward, zbst, zbstPrice])
}