export const isOdd = n => {
  return Boolean(n % 2)
}

export const isEven = n => {
  return !isOdd(n)
}

export default {
  isOdd,
  isEven
}
