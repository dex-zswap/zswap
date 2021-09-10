import BigNumber from 'bignumber.js'
import { LP_REWARDS } from 'config/reward/lp'

export const EVERY_DAY_SECS = new BigNumber(24 * 60 * 60 * 1000)

const PER_DAY_BLOCK_NUMBER = 14400

const keys = Object.keys(LP_REWARDS).reverse()

class OnlineInfo {
  private blockNumber: number = 0
  private blockTime: number = 0

  public countDownTime: number = 0
  public onlineTime: number = 0

  setBlock(blockNumber: number, blockTime: number) {
    this.blockNumber = blockNumber
    this.blockTime = blockTime
    this.calcCountDownTime()

    console.log('当前产块数量: ', this.blockNumber)
    console.log('初始块高时间: ', this.blockTime)
  }

  calcCountDownTime() {
    const { blockDay, maxDay } = this.getDayOffset()
    const maxDayBigNumber = new BigNumber(maxDay)
    const blockDayBigNumber = new BigNumber(blockDay)
    const currentTimeStamp = new BigNumber(+new Date())
    const onlineTime = currentTimeStamp.minus(EVERY_DAY_SECS.multipliedBy(blockDayBigNumber)).integerValue(BigNumber.ROUND_HALF_UP)
    const countDownTime = onlineTime.plus(EVERY_DAY_SECS.multipliedBy(maxDayBigNumber)).integerValue(BigNumber.ROUND_HALF_UP)

    this.countDownTime = countDownTime.toNumber()
    this.onlineTime = onlineTime.toNumber()
  }

  getDayOffset() {
    const blockDay = this.blockNumber / PER_DAY_BLOCK_NUMBER
    let maxDay = 0

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

  outFirstWeek() {
    const { blockDay } = this.getDayOffset()
    return blockDay > 7
  }
}

const onlineInfo = new OnlineInfo()

export default onlineInfo
