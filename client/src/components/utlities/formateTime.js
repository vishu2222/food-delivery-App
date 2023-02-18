export function formatTime(timeStamp) {
  const dateTime = new Date(timeStamp)
  const hours = dateTime.getHours()
  const minutes = dateTime.getMinutes()
  const hoursString = hours < 10 ? '0' + hours.toString() : hours.toString()
  const minutesString = minutes < 10 ? '0' + minutes.toString() : minutes.toString()
  return hoursString + ':' + minutesString
}
