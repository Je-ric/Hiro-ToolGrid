const ROMAN_MAP = { M:1000, CM:900, D:500, CD:400, C:100, XC:90, L:50, XL:40, X:10, IX:9, V:5, IV:4, I:1 }

export const ROMAN_REFS = [['I',1],['V',5],['X',10],['L',50],['C',100],['D',500],['M',1000]]

export function romanToNumber(roman) {
  roman = roman.toUpperCase()
  let i = 0, result = 0
  while (i < roman.length) {
    const two = roman.substring(i, i + 2)
    if (ROMAN_MAP[two])      { result += ROMAN_MAP[two]; i += 2 }
    else if (ROMAN_MAP[roman[i]]) { result += ROMAN_MAP[roman[i]]; i++ }
    else return null
  }
  return result
}

export function numberToRoman(num) {
  if (num < 1 || num > 3999) return null
  let result = ''
  for (const key in ROMAN_MAP) { while (num >= ROMAN_MAP[key]) { result += key; num -= ROMAN_MAP[key] } }
  return result
}
