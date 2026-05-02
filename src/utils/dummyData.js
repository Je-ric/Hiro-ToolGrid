const LOREM_WORDS = ['lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim','ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi','aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit','voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint','occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt','mollit','anim','id','est']
const FIRST_NAMES = ['James','Maria','John','Patricia','Robert','Jennifer','Michael','Linda','William','Barbara','David','Susan','Richard','Jessica','Joseph','Sarah','Thomas','Karen','Charles','Lisa','Ana','Carlos','Sofia','Miguel','Isabella','Lucas','Valentina','Diego','Camila','Andres']
const LAST_NAMES  = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Taylor','Anderson','Thomas','Jackson','White','Harris','Martin','Thompson','Young','Lee','Walker','Santos','Reyes','Cruz','Flores','Rivera','Gomez','Torres','Ramirez','Diaz','Morales']
const DOMAINS     = ['gmail.com','yahoo.com','outlook.com','hotmail.com','mail.com','proton.me','icloud.com']
const PREFIXES    = ['+1','+63','+44','+61','+81']

const ri   = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = arr => arr[Math.floor(Math.random() * arr.length)]

function sentence() {
  const words = Array.from({ length: ri(8, 18) }, () => pick(LOREM_WORDS)).join(' ')
  return words[0].toUpperCase() + words.slice(1) + '.'
}

function paragraph() {
  return Array.from({ length: ri(4, 7) }, sentence).join(' ')
}

export function generateLorem(type, count) {
  count = Math.max(1, count)
  if (type === 'words')     return Array.from({ length: count }, () => pick(LOREM_WORDS)).join(' ')
  if (type === 'sentences') return Array.from({ length: count }, sentence).join(' ')
  return Array.from({ length: count }, paragraph).join('\n\n')
}

export function generateName()  { return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}` }

export function generateEmail() {
  const sep = pick(['.', '_', ''])
  const num = ri(0, 1) ? ri(0, 99) : ''
  return `${pick(FIRST_NAMES).toLowerCase()}${sep}${pick(LAST_NAMES).toLowerCase()}${num}@${pick(DOMAINS)}`
}

export function generatePhone() {
  let n = ''
  for (let i = 0; i < 10; i++) { n += ri(0, 9); if (i === 2 || i === 5) n += '-' }
  return `${pick(PREFIXES)} ${n}`
}

export function generateDate() {
  const y = ri(1970, 2025), m = ri(1, 12), d = ri(1, 28)
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export function generateColor() {
  const r = ri(0, 255), g = ri(0, 255), b = ri(0, 255)
  const hex = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
  return `${hex}  rgb(${r}, ${g}, ${b})`
}
