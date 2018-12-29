function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  date = new Date(date * 1000)
  const year = date.getFullYear().toString().substr(2, 2)
  const month = date.getMonth() + 1
  const day = date.getDate()

  // const hour = date.getHours()
  // const minute = date.getMinutes()
  // const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('-')
  // const t1 = [year, month, day].map(formatNumber).join('/')
  // const t2 = [hour, minute, second].map(formatNumber).join(':')
  return t1
  // return `${t1} ${t2}`
}

export const getWeek = function (date = new Date()) {
  const now = new Date(date)
  const firstDay = new Date(new Date(date).setMonth(0, 1))
  let firstDayOfWeek = firstDay.getDay()
  if (firstDayOfWeek === 0 || firstDayOfWeek === 1) firstDayOfWeek += 7
  const diffDay = (now.valueOf() - firstDay.valueOf()) / 86400000 - (8 - firstDayOfWeek)
  if (diffDay >= 0) {
    return [now.getFullYear(), Math.floor(diffDay / 7) + 1]
  } else {
    return getWeek(`${now.getFullYear() - 1}-12-31`)
  }
}

export const formatTime2 = function (date = new Date()) {
  const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  date = new Date(date)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekDay = date.getDay()
  return `${weekMap[weekDay]} ${month}/${day}`
}

export default {
  formatNumber,
  formatTime
}
