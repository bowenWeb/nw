import Decimal from 'decimal.js'
const formatAmount = (str:string) => {
  try {
    if (str === '0') return '0'
    const value = new Decimal(str ?? '0').div(Math.pow(10, 18)).toFixed(2, Decimal.ROUND_DOWN)
    return value
  } catch (error) {
    return '0'
  }
}
const amountToNW = (str:string) => {
  try {
    if (str === '0') return '0'
    const value = new Decimal(str ?? '0').times(Math.pow(10, 18)).toString()
    return value
  } catch (error) {
    return '0'
  }
}

const truncateString = (str, length = 3) => {
  return str.length > length * 2
    ? `${str.slice(0, length)}...${str.slice(-length)}`
    : str
}

export {
  amountToNW,
  formatAmount,
  truncateString
}
