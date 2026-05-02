export function calcBMI(weight, height, unit) {
  let bmi
  if (unit === 'metric') {
    // weight kg, height cm
    const hm = height / 100
    bmi = weight / (hm * hm)
  } else {
    // weight lbs, height inches
    bmi = (703 * weight) / (height * height)
  }
  return Math.round(bmi * 10) / 10
}

export function getCategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight',     color: 'text-blue-500',   bg: 'bg-blue-50',   border: 'border-blue-200',   gauge: 10 }
  if (bmi < 25)   return { label: 'Normal weight',   color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  gauge: 35 }
  if (bmi < 30)   return { label: 'Overweight',      color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', gauge: 62 }
  if (bmi < 35)   return { label: 'Obese (Class I)', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', gauge: 78 }
  return           { label: 'Obese (Class II+)',     color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    gauge: 92 }
}

export function idealWeight(height, unit) {
  // Devine formula
  if (unit === 'metric') {
    const hIn = height / 2.54
    const base = hIn > 60 ? 50 + 2.3 * (hIn - 60) : 50
    return { min: Math.round(base - 5), max: Math.round(base + 5), unit: 'kg' }
  } else {
    const base = height > 60 ? 110 + 5.1 * (height - 60) : 110
    return { min: Math.round(base - 11), max: Math.round(base + 11), unit: 'lbs' }
  }
}

export const BMI_RANGES = [
  { label: '< 18.5',    desc: 'Underweight',     color: 'bg-blue-400' },
  { label: '18.5–24.9', desc: 'Normal',           color: 'bg-green-500' },
  { label: '25–29.9',   desc: 'Overweight',       color: 'bg-yellow-400' },
  { label: '30–34.9',   desc: 'Obese I',          color: 'bg-orange-400' },
  { label: '≥ 35',      desc: 'Obese II+',        color: 'bg-red-500' },
]
