export function isOdd (n) {
  return Boolean(n % 2)
}

export function isEven (n) {
  return !isOdd(n)
}

export default {
  isOdd,
  isEven
}
