import BigNumber from 'bignumber.js'
import { getOnlineDayOffset } from 'config/constants/zswap/online-time'

const RATE = new BigNumber(0.7)
const WEEK_DAYS = new BigNumber(7)

const REWARDS = {
  10080000: [0, 14],
  5040000: [15, 42],
  2520000: [43, 98],
  1260000: [105, 365],
}

export default function getLpReward(allWeight: number[], weight: number) {
  const dayOffset = getOnlineDayOffset()
  let reward

  const totalWeights = allWeight.reduce((result, current) => result + current, 0)
  const weightRate = new BigNumber(weight).dividedBy(new BigNumber(totalWeights))

  Object.keys(REWARDS).forEach((key) => {
    const [minDate, maxDate] = REWARDS[key]
    if (minDate <= dayOffset && maxDate >= dayOffset) {
      reward = new BigNumber(key).dividedBy(WEEK_DAYS).multipliedBy(RATE)
    }
  })

  return reward.multipliedBy(weightRate)
}
