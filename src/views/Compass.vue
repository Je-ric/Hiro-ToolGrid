<template>
  <ToolLayout title="Compass" subtitle="Degree calculator, rotation mode, and directional arrow display">
    <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

      <!-- Controls -->
      <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-4">
        <CardHeader icon="bx-compass">Controls</CardHeader>

        <!-- Degree input -->
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">Bearing (0°–360°)</label>
          <div class="flex gap-2">
            <input v-model.number="degree" type="number" min="0" max="360" placeholder="0"
              class="flex-1 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              @input="clampDegree" />
            <span class="flex items-center text-gray-500 font-semibold text-sm">°</span>
          </div>
        </div>

        <!-- Slider -->
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">Rotate</label>
          <input type="range" v-model.number="degree" min="0" max="360" class="w-full accent-blue-500" />
        </div>

        <!-- Quick directions -->
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">Quick Set</label>
          <div class="grid grid-cols-3 gap-2">
            <button v-for="d in quickDirs" :key="d.deg" @click="degree = d.deg"
              :class="['py-2 rounded-xl text-xs font-semibold transition-colors border',
                degree === d.deg ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300']">
              {{ d.label }}
            </button>
          </div>
        </div>

        <!-- Rotation mode toggle -->
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">Rotation Mode</label>
          <div class="flex rounded-xl overflow-hidden border border-gray-200">
            <button v-for="m in ['arrow','compass']" :key="m" @click="rotMode = m"
              :class="['flex-1 py-2 text-xs font-semibold transition-colors', rotMode === m ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50']">
              {{ m === 'arrow' ? '↑ Arrow' : '🧭 Compass' }}
            </button>
          </div>
          <p class="text-xs text-gray-400">{{ rotMode === 'arrow' ? 'Arrow points toward the bearing.' : 'Compass rose rotates to face North.' }}</p>
        </div>
      </div>

      <!-- Compass display -->
      <div class="flex flex-col items-center gap-4">
        <div class="relative w-72 h-72 select-none"
          @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag"
          @touchstart.prevent="startDragTouch" @touchmove.prevent="onDragTouch" @touchend="stopDrag">

          <!-- Outer degree ring -->
          <svg class="absolute inset-0 w-full h-full" viewBox="0 0 288 288">
            <circle cx="144" cy="144" r="138" fill="#1e293b" stroke="#334155" stroke-width="2"/>
            <circle cx="144" cy="144" r="110" fill="#0f172a"/>
            <!-- Tick marks -->
            <g v-for="i in 72" :key="i">
              <line
                :x1="144 + 128 * Math.sin((i-1)*5 * Math.PI/180)"
                :y1="144 - 128 * Math.cos((i-1)*5 * Math.PI/180)"
                :x2="144 + (((i-1)%2===0) ? 118 : 122) * Math.sin((i-1)*5 * Math.PI/180)"
                :y2="144 - (((i-1)%2===0) ? 118 : 122) * Math.cos((i-1)*5 * Math.PI/180)"
                stroke="#64748b" stroke-width="1.5"/>
            </g>
            <!-- Cardinal degree labels -->
            <g v-for="d in [0,45,90,135,180,225,270,315]" :key="d">
              <text
                :x="144 + 100 * Math.sin(d * Math.PI/180)"
                :y="148 - 100 * Math.cos(d * Math.PI/180)"
                text-anchor="middle" font-size="9" fill="#94a3b8" font-family="Oswald,sans-serif">
                {{ d }}°
              </text>
            </g>
            <!-- Cardinal letters -->
            <g v-for="c in cardinals" :key="c.label">
              <text
                :x="144 + 88 * Math.sin(c.deg * Math.PI/180)"
                :y="148 - 88 * Math.cos(c.deg * Math.PI/180)"
                text-anchor="middle" font-size="13"
                :fill="c.deg === 0 ? '#f43f5e' : '#e2e8f0'"
                font-family="Oswald,sans-serif" font-weight="700">
                {{ c.label }}
              </text>
            </g>
            <!-- Rotating needle / compass rose -->
            <g :transform="`rotate(${rotMode === 'arrow' ? degree : -degree}, 144, 144)`">
              <!-- Arrow needle -->
              <polygon points="144,50 138,144 144,160 150,144" fill="#f43f5e"/>
              <polygon points="144,238 138,144 144,128 150,144" fill="#94a3b8"/>
              <circle cx="144" cy="144" r="8" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
            </g>
            <!-- Center dot -->
            <circle cx="144" cy="144" r="4" fill="#f43f5e"/>
          </svg>

          <!-- Drag hint -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span v-if="!dragging" class="text-slate-600 text-xs mt-20 opacity-50">drag to rotate</span>
          </div>
        </div>

        <!-- Degree readout -->
        <div class="text-center">
          <p class="text-5xl font-bold text-gray-800">{{ normDeg }}°</p>
          <p class="text-xl font-semibold text-blue-500 mt-1">{{ directionLabel }}</p>
          <p class="text-sm text-gray-400 mt-1">{{ directionFull }}</p>
        </div>
      </div>

      <!-- Info panel -->
      <div class="flex flex-col gap-4">
        <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
          <CardHeader icon="bx-info-circle">Bearing Info</CardHeader>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-gray-50 rounded-xl p-3 text-center">
              <p class="text-xs text-gray-400 mb-1">Bearing</p>
              <p class="text-2xl font-bold text-blue-600">{{ normDeg }}°</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-3 text-center">
              <p class="text-xs text-gray-400 mb-1">Direction</p>
              <p class="text-2xl font-bold text-gray-800">{{ directionLabel }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-3 text-center">
              <p class="text-xs text-gray-400 mb-1">Opposite</p>
              <p class="text-2xl font-bold text-gray-500">{{ oppositeDeg }}°</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-3 text-center">
              <p class="text-xs text-gray-400 mb-1">Quadrant</p>
              <p class="text-lg font-bold text-purple-600">{{ quadrant }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
          <CardHeader icon="bx-map">All Directions</CardHeader>
          <div class="grid grid-cols-3 gap-1 text-center text-xs">
            <div v-for="d in allDirs" :key="d.label"
              :class="['rounded-lg p-2 transition-colors', d.label === directionLabel ? 'bg-blue-500 text-white font-bold' : 'bg-gray-50 text-gray-600']">
              <div class="font-semibold">{{ d.label }}</div>
              <div class="opacity-70">{{ d.deg }}°</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import CardHeader from '../components/ui/CardHeader.vue'

const degree  = ref(0)
const rotMode = ref('arrow')
const dragging = ref(false)
let compassEl = null

const normDeg = computed(() => ((degree.value % 360) + 360) % 360)

const allDirs = [
  { label:'N',   deg:0   }, { label:'NNE', deg:22  }, { label:'NE',  deg:45  },
  { label:'ENE', deg:67  }, { label:'E',   deg:90  }, { label:'ESE', deg:112 },
  { label:'SE',  deg:135 }, { label:'SSE', deg:157 }, { label:'S',   deg:180 },
  { label:'SSW', deg:202 }, { label:'SW',  deg:225 }, { label:'WSW', deg:247 },
  { label:'W',   deg:270 }, { label:'WNW', deg:292 }, { label:'NW',  deg:315 },
  { label:'NNW', deg:337 },
]

const cardinals = [
  { label:'N', deg:0 }, { label:'E', deg:90 }, { label:'S', deg:180 }, { label:'W', deg:270 },
]

const quickDirs = [
  { label:'N 0°',   deg:0   }, { label:'NE 45°',  deg:45  }, { label:'E 90°',  deg:90  },
  { label:'SE 135°',deg:135 }, { label:'S 180°',  deg:180 }, { label:'SW 225°',deg:225 },
  { label:'W 270°', deg:270 }, { label:'NW 315°', deg:315 }, { label:'↺ Reset',deg:0   },
]

const directionLabel = computed(() => {
  const d = normDeg.value
  const match = allDirs.reduce((prev, cur) => {
    const diff = Math.abs(((d - cur.deg + 540) % 360) - 180)
    const prevDiff = Math.abs(((d - prev.deg + 540) % 360) - 180)
    return diff < prevDiff ? cur : prev
  })
  return match.label
})

const directionFull = computed(() => {
  const map = { N:'North', NNE:'North-Northeast', NE:'Northeast', ENE:'East-Northeast', E:'East', ESE:'East-Southeast', SE:'Southeast', SSE:'South-Southeast', S:'South', SSW:'South-Southwest', SW:'Southwest', WSW:'West-Southwest', W:'West', WNW:'West-Northwest', NW:'Northwest', NNW:'North-Northwest' }
  return map[directionLabel.value] || ''
})

const oppositeDeg = computed(() => (normDeg.value + 180) % 360)

const quadrant = computed(() => {
  const d = normDeg.value
  if (d < 90)  return 'NE'
  if (d < 180) return 'SE'
  if (d < 270) return 'SW'
  return 'NW'
})

function clampDegree() {
  if (degree.value < 0)   degree.value = 0
  if (degree.value > 360) degree.value = 360
}

function getAngleFromEvent(e, el) {
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dx = e.clientX - cx
  const dy = e.clientY - cy
  let angle = Math.atan2(dx, -dy) * (180 / Math.PI)
  return ((angle % 360) + 360) % 360
}

function startDrag(e) {
  dragging.value = true
  compassEl = e.currentTarget
  degree.value = Math.round(getAngleFromEvent(e, compassEl))
}
function onDrag(e) {
  if (!dragging.value) return
  degree.value = Math.round(getAngleFromEvent(e, compassEl))
}
function stopDrag() { dragging.value = false }

function startDragTouch(e) {
  dragging.value = true
  compassEl = e.currentTarget
  degree.value = Math.round(getAngleFromEvent(e.touches[0], compassEl))
}
function onDragTouch(e) {
  if (!dragging.value) return
  degree.value = Math.round(getAngleFromEvent(e.touches[0], compassEl))
}
</script>
