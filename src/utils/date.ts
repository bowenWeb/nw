import dayjs from 'dayjs'

const formatDate = (value:number, format = 'YYYY-MM-DD') => {
  if (value) {
    const str = dayjs(value).format(format)
    return str
  }
  return '-'
}
export {
  formatDate
}
