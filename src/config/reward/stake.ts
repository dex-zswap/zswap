import BigNumber from 'bignumber.js'

const REWARDS = new BigNumber(150000000)

export default function getStakeReward(allWeight: number[], weight: number) {
  const totalWeights = allWeight.reduce((result, current) => (result + current), 0)
  const weightRate = new BigNumber(weight).dividedBy(new BigNumber(totalWeights))

  return REWARDS.multipliedBy(weightRate)
}
