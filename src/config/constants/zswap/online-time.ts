import dayjs from 'dayjs'

const isBuild = ['dev', 'test'].includes(process.env.BUILD_TYPE)
const ONLINE_TIME = +new Date('2021-09-08 12:00:00')
const ONLINE_DAYJS = dayjs(ONLINE_TIME)

const HALF_RANGE = [
  [0, 14],
  [15, 42],
  [43, 98],
  [105, 365],
]

export const DATE_SECS = 24 * 60 * 60 * 1000

export default ONLINE_TIME

export function getOnlineDayOffset(down: boolean = true) {
  const now = Date.now()
  const offset = (now - ONLINE_TIME) / DATE_SECS
  return down ? Math.floor(offset) : Math.ceil(offset)
}

export function getHalfDownInfo() {
  const now = Date.now()
  const dayOffset = getOnlineDayOffset(false)
  const rangeIndex = HALF_RANGE.findIndex((range) => range[0] <= dayOffset && range[1] >= dayOffset)
  const daysRange = HALF_RANGE[rangeIndex]

  if (daysRange) {
    const halfDownDate = ONLINE_DAYJS.clone().add(daysRange[1], 'days').toDate()
    const offset = +halfDownDate - now

    const days = Math.floor(offset / 1000 / 60 / 60 / 24)
    const hours = Math.floor((offset / 1000 / 60 / 60) % 24)
    const minutes = Math.floor((offset / 1000 / 60) % 60)
    const seconds = Math.floor((offset / 1000) % 60)

    return {
      isCounting: true,
      days: days > 9 ? days : `0${days}`,
      hours: hours > 9 ? hours : `0${hours}`,
      minutes: minutes > 9 ? minutes : `0${minutes}`,
      seconds: seconds > 9 ? seconds : `0${seconds}`,
    }
  } else {
    return {
      isCounting: false,
      days: -1,
      hours: -1,
      minutes: -1,
      seconds: -1,
    }
  }
}
