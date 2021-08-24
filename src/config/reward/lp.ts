import BigNumber from 'bignumber.js'

const isBuild = ['dev', 'test'].includes(process.env.BUILD_TYPE)
const date = new Date()
const ONLINE_TIME = isBuild ? +date : Date.now()
const DATE_SECS = 24 * 60 * 60 * 1000

const RATE = new BigNumber(0.7)

const REWARDS = {
  10080000: [0, 14],
  5040000: [15, 42],
  2520000: [43, 98],
  1260000: [105, Number.MAX_SAFE_INTEGER],
}

export default function getLpReward(allWeight: number[], weight: number) {
  const now = Date.now()
  const dayOffset = Math.floor((now - ONLINE_TIME) / DATE_SECS)
  let reward

  const totalWeights = allWeight.reduce((result, current) => result + current, 0)
  const weightRate = new BigNumber(weight).dividedBy(new BigNumber(totalWeights))

  Object.keys(REWARDS).forEach((key) => {
    const [minDate, maxDate] = REWARDS[key]
    if (minDate <= dayOffset && maxDate >= dayOffset) {
      reward = new BigNumber(key).multipliedBy(RATE)
    }
  })

  return reward.multipliedBy(weightRate)
}
