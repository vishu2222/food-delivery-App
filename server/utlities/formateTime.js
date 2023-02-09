export function formatTime(dbTimeStamp) {
  // need to accept another argument to
  const dateTime = new Date(dbTimeStamp)
  const hours = dateTime.getHours()
  const minutes = dateTime.getMinutes()
  const hoursString = hours < 10 ? '0' + hours.toString() : hours.toString()
  const minutesString = minutes < 10 ? '0' + minutes.toString() : minutes.toString()
  return hoursString + ':' + minutesString
}
