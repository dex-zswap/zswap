import BigNumber from 'bignumber.js'

const REWARDS = new BigNumber(15000000)
const STAKE_DAYS = new BigNumber(90)

export default function getStakeReward(weightRate: BigNumber) {
  return REWARDS.dividedBy(STAKE_DAYS).multipliedBy(weightRate)
}
