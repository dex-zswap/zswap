import BigNumber from 'bignumber.js'
import onlineInfo from 'utils/online-info'

const RATE = new BigNumber(0.7)
const WEEK_DAYS = new BigNumber(7)

export const LP_REWARDS = {
  10080000: [0, 14],
  5040000: [14, 42],
  2520000: [42, 98],
  1260000: [98, 280],
}

export default function getLpReward(allWeight: number[], weight: number) {
  const { floor: dayOffset } = onlineInfo.getDayOffset()
  let reward

  const totalWeights = allWeight.reduce((result, current) => result + current, 0)
  const weightRate = new BigNumber(weight).dividedBy(new BigNumber(totalWeights))

  Object.keys(LP_REWARDS).forEach((key) => {
    const [minDate, maxDate] = LP_REWARDS[key]
    if (minDate <= dayOffset && maxDate >= dayOffset) {
      reward = new BigNumber(key).dividedBy(WEEK_DAYS).multipliedBy(RATE)
    }
  })

  return reward.multipliedBy(weightRate)
}
