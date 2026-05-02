import { ref, computed, onUnmounted } from 'vue'

export function usePomodoro() {
  const MODES = {
    focus: { label: 'Focus',       color: 'text-rose-500',   ring: '#f43f5e', bg: 'bg-rose-50'   },
    short: { label: 'Short Break', color: 'text-emerald-500', ring: '#10b981', bg: 'bg-emerald-50' },
    long:  { label: 'Long Break',  color: 'text-blue-500',   ring: '#3b82f6', bg: 'bg-blue-50'   },
  }

  const settings = ref({ focus: 25, short: 5, long: 15, longAfter: 4 })
  const mode     = ref('focus')
  const running  = ref(false)
  const seconds  = ref(settings.value.focus * 60)
  const cycle    = ref(0)          // completed focus sessions
  const sessions = ref([])         // { task, duration, completedAt }
  const tasks    = ref([])         // { id, text, done }
  const activeTask = ref('')
  let   timer    = null

  const totalSeconds = computed(() => {
    if (mode.value === 'focus') return settings.value.focus * 60
    if (mode.value === 'short') return settings.value.short * 60
    return settings.value.long * 60
  })

  const progress = computed(() => {
    const total = totalSeconds.value
    return total > 0 ? ((total - seconds.value) / total) * 100 : 0
  })

  const display = computed(() => {
    const m = Math.floor(seconds.value / 60)
    const s = seconds.value % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  })

  const currentMode = computed(() => MODES[mode.value])

  function setMode(m) {
    stop()
    mode.value = m
    seconds.value = (m === 'focus' ? settings.value.focus : m === 'short' ? settings.value.short : settings.value.long) * 60
  }

  function start() {
    if (running.value) return
    running.value = true
    timer = setInterval(tick, 1000)
  }

  function pause() {
    running.value = false
    clearInterval(timer)
  }

  function stop() {
    pause()
    seconds.value = totalSeconds.value
  }

  function tick() {
    if (seconds.value <= 0) {
      complete()
      return
    }
    seconds.value--
  }

  function complete() {
    pause()
    if (mode.value === 'focus') {
      cycle.value++
      sessions.value.unshift({
        task: activeTask.value || 'Untitled session',
        duration: settings.value.focus,
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
      // auto-switch to break
      const nextMode = cycle.value % settings.value.longAfter === 0 ? 'long' : 'short'
      setMode(nextMode)
    } else {
      setMode('focus')
    }
  }

  function skip() { complete() }

  function addTask(text) {
    if (!text.trim()) return
    tasks.value.push({ id: Date.now(), text: text.trim(), done: false })
  }

  function toggleTask(id) {
    const t = tasks.value.find(t => t.id === id)
    if (t) t.done = !t.done
  }

  function removeTask(id) {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  function applySettings() {
    stop()
    seconds.value = totalSeconds.value
  }

  onUnmounted(() => clearInterval(timer))

  return {
    MODES, settings, mode, running, seconds, cycle, sessions, tasks, activeTask,
    progress, display, currentMode, totalSeconds,
    setMode, start, pause, stop, skip, addTask, toggleTask, removeTask, applySettings,
  }
}
