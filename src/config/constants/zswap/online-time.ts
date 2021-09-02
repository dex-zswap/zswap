const isBuild = ['dev', 'test'].includes(process.env.BUILD_TYPE)
const ONLINE_TIME = +(new Date('2021-08-25 18:00:00'))

export const DATE_SECS = 24 * 60 * 60 * 1000

export default ONLINE_TIME

export function getOnlineDayOffset() {
  const now = Date.now()
  return Math.floor((now - ONLINE_TIME) / DATE_SECS)
}
