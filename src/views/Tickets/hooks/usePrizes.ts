import { useMemo, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useZSwapLotteryContract, useZSwapLPContract } from 'hooks/useContract'
import { useBlockNumber } from 'state/application/hooks'
import { useContractCall } from 'hooks/useContractCall'
import { useZBToken } from 'hooks/Tokens'
import { useZBZUSTPrice } from 'hooks/useZUSDPrice'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'

export function useWinNumbers(lotteryId: string) {
  const lotteryContract = useZSwapLotteryContract()
  const [ winNumbers, setWinNumber ] = useState([])
  const idIndex = lotteryId ? [0, 1, 2, 3, 4, 5].map((index) => [lotteryId, index]) : []

  useEffect(() => {
    const fetchWinNumbers = async () => {
      try {
        const callQueue = idIndex.map((args) => lotteryContract.lottoWinningNumbers(...args))
        const results = await Promise.all(callQueue)
  
        if (results.length === idIndex.length) {
          setWinNumber(() => results)
        }
      } catch (e) {}
    }

    if (idIndex.length) {
      fetchWinNumbers()
    }
  }, [lotteryContract])

  return winNumbers
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

    const lotteryRewardBigNumber = lotteryReward.result
      ? new BigNumber(lotteryReward.result.toString()).dividedBy(BIG_TEN.pow(zbst.decimals))
      : BIG_ZERO
    const lpRewardBigNumber = lpReward.result
      ? new BigNumber(lpReward.result.toString()).dividedBy(BIG_TEN.pow(zbst.decimals))
      : BIG_ZERO
    const priceBigNumber = new BigNumber(zbstPrice.toSignificant(6))

    return [lotteryRewardBigNumber, lpRewardBigNumber].reduce((res, cur) => {
      return res.plus(cur.multipliedBy(priceBigNumber))
    }, BIG_ZERO)
  }, [lotteryReward, lpReward, zbst, zbstPrice])
}
