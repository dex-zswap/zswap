import dayjs from 'dayjs'
import onlineInfo from 'utils/online-info'

export const EVERY_DAY_SECS = 24 * 60 * 60 * 1000

export function getHalfDownInfo() {
  const now = new Date().getTime()
  const { countDownTime } = onlineInfo

  if (countDownTime > 0) {
    const halfDownDate = dayjs(countDownTime).toDate()
    const offset = +halfDownDate - now

    const days = Math.max(Math.floor(offset / 1000 / 60 / 60 / 24), 0)
    const hours = Math.max(Math.floor((offset / 1000 / 60 / 60) % 24), 0)
    const minutes = Math.max(Math.floor((offset / 1000 / 60) % 60), 0)
    const seconds = Math.max(Math.floor((offset / 1000) % 60), 0)

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

  return {
    isCounting: false,
    days: -1,
    hours: -1,
    minutes: -1,
    seconds: -1,
  }
}
