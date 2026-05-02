const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

function daysInMonth(month, year) {
  if (month === 2) return (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) ? 29 : 28
  return [4, 6, 9, 11].includes(month) ? 30 : 31
}

export function calcAge(dobStr, targetStr) {
  const dob    = new Date(dobStr)
  const target = new Date(targetStr)

  const dobY = dob.getFullYear(), dobM = dob.getMonth() + 1, dobD = dob.getDate()
  const tarY = target.getFullYear(), tarM = target.getMonth() + 1, tarD = target.getDate()

  let years = tarY - dobY, months = tarM - dobM, days = tarD - dobD
  if (days < 0)   { months--; days += daysInMonth(tarM - 1 === 0 ? 12 : tarM - 1, tarM - 1 === 0 ? tarY - 1 : tarY) }
  if (months < 0) { years--;  months += 12 }

  const diffMs     = target - dob
  const totalDays  = Math.floor(diffMs / 86400000)
  const totalWeeks = Math.floor(totalDays / 7)
  const totalHours = totalDays * 24
  const totalMins  = totalHours * 60

  const nextBday = new Date(tarY, dobM - 1, dobD)
  if (nextBday <= target) nextBday.setFullYear(tarY + 1)
  const daysToNext = Math.round((nextBday - target) / 86400000)

  return {
    years, months, days,
    totalMonths: years * 12 + months,
    totalWeeks, totalDays, totalHours, totalMins,
    daysToNext,
    bornDay: DAY_NAMES[dob.getDay()],
  }
}

export function todayString() {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}
