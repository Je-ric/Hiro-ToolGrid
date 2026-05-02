export const CATEGORIES = {
  length:  { title:'Length',        base:'meter',    units:{ millimeter:0.001, centimeter:0.01, meter:1, kilometer:1000, inch:0.0254, foot:0.3048, yard:0.9144, mile:1609.344, 'nautical mile':1852 } },
  weight:  { title:'Weight / Mass', base:'kilogram', units:{ milligram:0.000001, gram:0.001, kilogram:1, 'metric ton':1000, ounce:0.0283495, pound:0.453592, stone:6.35029 } },
  temp:    { title:'Temperature',   base:null,       units:{ Celsius:1, Fahrenheit:1, Kelvin:1 } },
  area:    { title:'Area',          base:'sq meter', units:{ 'sq millimeter':0.000001, 'sq centimeter':0.0001, 'sq meter':1, 'sq kilometer':1000000, 'sq inch':0.00064516, 'sq foot':0.092903, 'sq yard':0.836127, acre:4046.86, hectare:10000 } },
  volume:  { title:'Volume',        base:'liter',    units:{ milliliter:0.001, liter:1, 'cubic meter':1000, 'cubic inch':0.0163871, 'cubic foot':28.3168, 'US gallon':3.78541, 'US quart':0.946353, 'US pint':0.473176, 'US cup':0.236588, 'US fl oz':0.0295735, tablespoon:0.0147868, teaspoon:0.00492892 } },
  speed:   { title:'Speed',         base:'m/s',      units:{ 'm/s':1, 'km/h':0.277778, mph:0.44704, knot:0.514444, 'ft/s':0.3048 } },
  time:    { title:'Time',          base:'second',   units:{ millisecond:0.001, second:1, minute:60, hour:3600, day:86400, week:604800, month:2629800, year:31557600 } },
  data:    { title:'Digital Data',  base:'byte',     units:{ bit:0.125, byte:1, kilobyte:1024, megabyte:1048576, gigabyte:1073741824, terabyte:1099511627776, petabyte:1125899906842624 } },
}

export function convertTemp(val, from, to) {
  const c = from === 'Celsius' ? val : from === 'Fahrenheit' ? (val - 32) * 5 / 9 : val - 273.15
  return to === 'Celsius' ? c : to === 'Fahrenheit' ? c * 9 / 5 + 32 : c + 273.15
}

export function convertUnits(val, fromUnit, toUnit, catKey) {
  if (catKey === 'temp') return convertTemp(val, fromUnit, toUnit)
  const units = CATEGORIES[catKey].units
  return (val * units[fromUnit]) / units[toUnit]
}

export function formatResult(res) {
  if (res === 0) return '0'
  return Math.abs(res) >= 0.0001 && Math.abs(res) < 1e12
    ? parseFloat(res.toPrecision(8)).toString()
    : res.toExponential(4)
}

export function buildReferenceItems(catKey) {
  if (catKey === 'temp') return ['0°C = 32°F = 273.15K','100°C = 212°F = 373.15K','-40°C = -40°F','37°C = 98.6°F (body)','20°C = 68°F (room)','-273.15°C = 0K (abs. zero)']
  const { units, base } = CATEGORIES[catKey]
  return Object.keys(units).filter(k => k !== base).map(k => {
    const f = units[k]
    return f >= 1 ? `1 ${base} = ${(1 / f).toPrecision(4)} ${k}` : `1 ${k} = ${f.toPrecision(4)} ${base}`
  })
}
