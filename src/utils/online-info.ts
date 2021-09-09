import BigNumber from 'bignumber.js'
import { LP_REWARDS } from 'config/reward/lp'

import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber'

export const EVERY_DAY_SECS = new BigNumber(24 * 60 * 60 * 1000)
export const OFFSET_DAY_SECS = new BigNumber(4 * 60 * 60 * 1000)

const keys = Object.keys(LP_REWARDS).reverse()

const daysAMount = []

keys.forEach((key, index) => {
  const range = LP_REWARDS[key]
  const daysOffset = range[1] - range[0]
  const rangeArray = new Array(daysOffset)
  const dayAmount = Number(key) / daysOffset
  let scale = daysOffset / 7
  daysAMount.push(...rangeArray.fill(dayAmount * scale))
})

class OnlineInfo {
  private blockNumber: number = 0
  private blockBigNumber: BigNumber = BIG_ZERO
  private blockTime: number = 0
  private blockTimeBigNumber: BigNumber = BIG_ZERO

  public countDownTime: number = 0

  setBlock(blockNumber: number, blockTime: number) {
    this.blockNumber = blockNumber
    this.blockBigNumber = new BigNumber(blockNumber)
    this.blockTime = blockTime
    this.blockTimeBigNumber = new BigNumber(blockTime)
    this.calcCountDownTime()
  }

  parseLocal() {
    const countDownInfo = localStorage.getItem('zswap_count_down_info')
    return countDownInfo ? JSON.parse(countDownInfo) : {}
  }

  calcCountDownTime() {
    const { blockDay, maxDay } = this.getDayOffset()
    const { maxDay: savedMaxDay } = this.parseLocal()
    const maxDayBigNumber = new BigNumber(maxDay)
    const blockDayBigNumber = new BigNumber(blockDay)

    if (!savedMaxDay || savedMaxDay !== maxDay) {
      this.countDownTime = this.blockTimeBigNumber
        .plus(OFFSET_DAY_SECS)
        .plus(maxDayBigNumber.minus(blockDayBigNumber).multipliedBy(EVERY_DAY_SECS))
        .integerValue(BigNumber.ROUND_CEIL)
        .toNumber()
      localStorage.setItem(
        'zswap_count_down_info',
        JSON.stringify({
          maxDay,
          time: this.countDownTime,
        }),
      )
    }
  }

  getDayOffset() {
    let blockDaies = BIG_ZERO
    let maxDay = BIG_ZERO
    let dayBlockPercent = BIG_ZERO
    let blockDay

    for (let i = 0, total = BIG_ZERO, currentDayAMount = BIG_ZERO, { length } = daysAMount; i < length; i++) {
      currentDayAMount = new BigNumber(daysAMount[i])
      dayBlockPercent = this.blockBigNumber.minus(total).dividedBy(currentDayAMount)

      if (dayBlockPercent.lt(BIG_ONE)) {
        blockDaies = blockDaies.plus(dayBlockPercent)
      } else {
        blockDaies = blockDaies.plus(BIG_ONE)
      }

      total = total.plus(currentDayAMount)

      if (total.gte(this.blockBigNumber)) {
        break
      }
    }

    blockDay = blockDaies.toString()

    for (let j = 0, range = null, { length } = keys; j < length; j++) {
      range = LP_REWARDS[keys[j]]

      if (range[0] <= blockDay && range[1] > blockDay) {
        maxDay = range[1]
      }
    }

    return {
      maxDay,
      blockDay,
      ceil: Math.ceil(blockDay),
      floor: Math.floor(blockDay),
    }
  }
}

const onlineInfo = new OnlineInfo()

export default onlineInfo
