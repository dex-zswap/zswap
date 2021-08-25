import BigNumber from 'bignumber.js'

const REWARDS = new BigNumber(150000000)

export default function getStakeReward(weightRate: BigNumber) {
  return REWARDS.multipliedBy(weightRate)
}
