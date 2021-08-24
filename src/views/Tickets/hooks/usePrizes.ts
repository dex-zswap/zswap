import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { arrayify } from '@ethersproject/bytes'
import { useZSwapLotteryContract, useZSwapLPContract } from 'hooks/useContract'
import { useBlockNumber } from 'state/application/hooks'
import { useContractCall } from 'hooks/useContractCall'
import { useZBToken } from 'hooks/Tokens'
import { useZBZUSTPrice } from 'hooks/useZUSDPrice'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'

export function useWinNumbers(lotteryId: string) {
  const lotteryContract = useZSwapLotteryContract()
  const winNumbers = useContractCall(lotteryContract, 'winningNumbers', [lotteryId])

  return winNumbers.result ? arrayify(winNumbers.result.toString()) : []
}

export default function usePrizes() {
  const lotteryContract = useZSwapLotteryContract()
  const lpContract = useZSwapLPContract()
  const zbst = useZBToken()
  const zbstPrice = useZBZUSTPrice()

  const blockNumber = useBlockNumber()

  const lotteryReward = useContractCall(lotteryContract, 'totalUsersCost', [])
  const lpReward = useContractCall(lpContract, 'getOtherTotalRewards', [blockNumber, 10])

  return useMemo(() => {
    if (!zbst || !zbstPrice) {
      return BIG_ZERO
    }

    const lotteryRewardBigNumber = lotteryReward.result ? new BigNumber(lotteryReward.result.toString()).dividedBy(BIG_TEN.pow(zbst.decimals)) : BIG_ZERO
    const lpRewardBigNumber = lpReward.result ? new BigNumber(lpReward.result.toString()).dividedBy(BIG_TEN.pow(zbst.decimals)) : BIG_ZERO
    const priceBigNumber = new BigNumber(zbstPrice.toSignificant(6))

    return [lotteryRewardBigNumber, lpRewardBigNumber].reduce((res, cur) => {
      return res.plus(cur.multipliedBy(priceBigNumber))
    }, BIG_ZERO)
  }, [lotteryReward, lpReward, zbst, zbstPrice])
}
