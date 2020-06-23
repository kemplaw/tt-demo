/**
 * @description: 获取零时零分零秒时的时间戳
 */
export function h0(timestamp = Date.now()) {
  const target = new Date(timestamp)

  target.setHours(0)
  target.setMinutes(0)
  target.setSeconds(0)
  target.setMilliseconds(0)

  return target.getTime()
}
