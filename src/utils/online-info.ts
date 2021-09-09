import { LP_REWARDS } from 'config/reward/lp'

const keys = Object.keys(LP_REWARDS).reverse()

const daysAMount = []

keys.forEach((key, index) => {
  const range = LP_REWARDS[key]
  const daysOffset = range[1] - range[0]
  const rangeArray = new Array(daysOffset)
  const dayAmount = Number(key) / daysOffset
  let scale = Math.ceil(daysOffset / 7)
  daysAMount.push(...rangeArray.fill(Math.floor(dayAmount * scale)))
})

class OnlineInfo {
  private currentBlock: number = 0

  setBlock(blockNumber: number) {
    this.currentBlock = Math.max(this.currentBlock, blockNumber)
    onlineInfo.getDayOffset()
  }

  getDayOffset() {
    let blockDay = 0
    let maxDay = 0

    for (let i = 0, total = 0, { length } = daysAMount; i < length; i ++) {
      total += daysAMount[i]
      if (total >= this.currentBlock) {
        blockDay = 1 / this.currentBlock * total
        break
      }
    }

    for (let j = 0, range = null, { length } = keys; j < length; j ++) {
      range = LP_REWARDS[keys[j]]

      if (range[0] <= blockDay && range[1] > blockDay) {
        maxDay = range[1]
      }
    }

    return {
      blockDay,
      maxDay,
      ceil: Math.ceil(blockDay),
      floor: Math.floor(blockDay)
    }
  }
}

const onlineInfo = new OnlineInfo()

export default onlineInfo
