import { useMemo, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useZSwapLotteryContract, useZSwapLPContract } from 'hooks/useContract'
import { useBlockNumber } from 'state/application/hooks'
import { useContractCall } from 'hooks/useContractCall'
import { useZBToken } from 'hooks/Tokens'
import { useZBSTZUSTPrice } from 'hooks/useZUSDPrice'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import { useHasOpened } from './useWinTime'

const apiBase = process.env.REACT_APP_API_BASE

export function useWinNumbers(lotteryId: string | number) {
  if (!Number(lotteryId)) {
    return []
  }
  const lotteryContract = useZSwapLotteryContract()
  const [winNumbers, setWinNumber] = useState([])
  const hasOpened = useHasOpened(lotteryId)
  useEffect(() => {
    const fetchWinNumbers = async () => {
      try {
        if (!hasOpened) {
          setWinNumber([])
        } else {
          const idIndex = [0, 1, 2, 3, 4, 5].map((index) => [Number(lotteryId), index])
          const callQueue = idIndex.map((args) => lotteryContract.lottoWinningNumbers(...args))
          const results = await Promise.all(callQueue)
          if (results.length === idIndex.length) {
            setWinNumber(() => results)
          }
        }
      } catch (e) {}
    }

    if (Number(lotteryId)) {
      fetchWinNumbers()
    }
  }, [hasOpened, lotteryContract, lotteryId])

  return winNumbers
}

export function useAllWinNumbers(currentLotteryId) {
  if (!Number(currentLotteryId)) {
    return {}
  }
  const hasOpened = useHasOpened(currentLotteryId)
  const lotteryContract = useZSwapLotteryContract()
  const [winNumbers, setWinNumber] = useState({})
  let lotteryNum = hasOpened ? currentLotteryId : Number(currentLotteryId) - 1
  const idIndex = useMemo(() => {
    lotteryNum = hasOpened ? currentLotteryId : Number(currentLotteryId) - 1

    const lotteryIds = lotteryNum ? new Array(lotteryNum).fill(0) : []
    const idIndex = lotteryIds
      .map((item, index) => {
        return [
          [index + 1, 0],
          [index + 1, 1],
          [index + 1, 2],
          [index + 1, 3],
          [index + 1, 4],
          [index + 1, 5],
        ]
      })
      .flat(1)

    return idIndex
  }, [hasOpened, currentLotteryId, lotteryNum])

  useEffect(() => {
    const fetchWinNumbers = async () => {
      try {
        const callQueue = []
        idIndex.forEach((args) => {
          callQueue.push(lotteryContract.lottoWinningNumbers(...args))
        })
        const results = await Promise.all(callQueue)
        const wins = {}
        for (let i = 1; i <= lotteryNum; i++) {
          wins[`lottery${i}`] = results.slice((i - 1) * 6, i * 6)
        }
        setWinNumber(() => wins)
      } catch (e) {}
    }

    if (idIndex.length) {
      fetchWinNumbers()
    }
  }, [lotteryContract, idIndex, lotteryNum])

  return winNumbers
}

export default function usePrizes(lotteryId) {
  const [lastLpReward, setLastLpReward] = useState(BIG_ZERO)
  const id = lotteryId - 1 || 1
  const lotteryContract = useZSwapLotteryContract()
  const zbstPrice = useZBSTZUSTPrice()
  const lottoTotalRewards = useContractCall(lotteryContract, 'lottoTotalRewards', [id])

  const lpContract = useZSwapLPContract()
  const zbst = useZBToken()
  const blockNumber = useBlockNumber()
  const totalUsersCost = useContractCall(lotteryContract, 'totalUsersCost', [])
  const lpReward = useContractCall(lpContract, 'getOtherTotalRewards', [blockNumber, 10])
  const totalRewardsTouser = useContractCall(lotteryContract, 'lottoTotalRewardsToUser', [id])

  useEffect(() => {
    const getLastLpReward = async (id) => {
      const res = await fetch(`${apiBase}/openprize/queryList`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (res.ok) {
        const { data } = await res.json()
        setLastLpReward(new BigNumber(data.reduce((pre, { reward }) => pre + Number(reward), 0)))
      } else {
        throw new Error(res.statusText)
      }
    }
    getLastLpReward(id)
  }, [id])

  return useMemo(() => {
    if (!zbst || !zbstPrice) {
      return { currentZustValue: '$-', currentZbRewards: '- ZBST' }
    }
    const lottoTotalRewardsBigNumber = lottoTotalRewards.result
      ? new BigNumber(lottoTotalRewards.result.toString()).dividedBy(BIG_TEN.pow(zbst.decimals))
      : BIG_ZERO
    const totalRewardsTouserBigNumber = totalRewardsTouser.result
      ? new BigNumber(totalRewardsTouser.result.toString()).dividedBy(BIG_TEN.pow(zbst.decimals))
      : BIG_ZERO

    const unRewardAmount = lottoTotalRewardsBigNumber.minus(totalRewardsTouserBigNumber)

    const lotteryRewardBigNumber = totalUsersCost.result
      ? new BigNumber(totalUsersCost.result.toString()).dividedBy(BIG_TEN.pow(zbst.decimals))
      : BIG_ZERO
    const lpRewardBigNumber = lpReward.result
      ? new BigNumber(lpReward.result.toString()).dividedBy(BIG_TEN.pow(zbst.decimals))
      : BIG_ZERO
    const priceBigNumber = new BigNumber(zbstPrice.toSignificant(6))

    const zustValue = [lotteryRewardBigNumber, lpRewardBigNumber, unRewardAmount].reduce((res, cur) => {
      return res.plus(cur.multipliedBy(priceBigNumber))
    }, BIG_ZERO)

    // console.group()
    // console.log(`用户买票:    ${lotteryRewardBigNumber.toFixed(2)}`)
    // console.log(`LP奖励:     ${lpRewardBigNumber}`)
    // console.log(`上期LP奖励:  ${lastLpReward}`)
    // console.log(`上期遗留:    ${lottoTotalRewardsBigNumber.toFixed(2)}`)
    // console.log(`上期领奖:    ${totalRewardsTouserBigNumber.toFixed(2)}`)
    // console.log(`Block:      ${blockNumber}`)
    // console.log(`ZBST:       ${zustValue.div(priceBigNumber).minus(lastLpReward).toFixed(2)}`)
    // console.groupEnd()

    return {
      currentZustValue: `$${zustValue.toFixed(2)}`,
      currentZbRewards: `${zustValue.div(priceBigNumber).minus(lastLpReward).toFixed(2)} ZBST`,
    }
  }, [totalUsersCost, lpReward, zbst, zbstPrice, totalRewardsTouser, lottoTotalRewards, lastLpReward])
}
