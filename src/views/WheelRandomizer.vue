<template>
  <ToolLayout title="Wheel Randomizer" subtitle="Add names or options, set weights, and spin the wheel to pick a random winner.">
    <div class="w-full flex flex-col gap-5">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

        <!-- Entries panel -->
        <BentoCard>
          <CardHeader icon="bx-list-ul">Entries</CardHeader>
          <p class="text-xs text-gray-400">Weight controls how likely an entry is to be picked. Higher weight = more likely.</p>

          <div class="flex flex-col gap-2 max-h-72 overflow-y-auto">
            <div v-for="(entry, i) in entries" :key="i" class="flex items-center gap-2">
              <span :class="['w-3 h-3 rounded-full shrink-0']" :style="{ background: getColor(i) }"></span>
              <input v-model="entry.label" class="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                placeholder="Entry name..." />
              <input v-model.number="entry.weight" type="number" min="1" max="100"
                class="w-16 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-300" />
              <button @click="removeEntry(i)" class="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
            </div>
          </div>

          <div class="flex gap-2">
            <AppBtn @click="addEntry" icon="bx-plus" variant="secondary">Add Entry</AppBtn>
            <AppBtn @click="loadDefaults" variant="ghost" icon="bx-reset">Reset</AppBtn>
          </div>

          <!-- Winner display -->
          <div v-if="winner" :class="['p-4 rounded-xl text-center border-2 transition-all', 'border-yellow-400 bg-yellow-50']">
            <p class="text-xs text-yellow-600 uppercase tracking-widest font-semibold">🎉 Winner!</p>
            <p class="text-2xl font-bold text-yellow-700 mt-1">{{ winner.label }}</p>
          </div>
        </BentoCard>

        <!-- Wheel canvas -->
        <BentoCard cls="items-center">
          <CardHeader icon="bx-circle">Spin the Wheel</CardHeader>
          <div class="relative flex items-center justify-center">
            <!-- Pointer -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 text-2xl">▼</div>
            <canvas ref="canvas" width="280" height="280" class="rounded-full shadow-lg"></canvas>
          </div>
          <AppBtn @click="spin" :disabled="spinning || entries.filter(e=>e.label).length < 2" icon="bx-rotate-right" cls="w-full mt-2">
            {{ spinning ? 'Spinning...' : 'Spin!' }}
          </AppBtn>
          <p class="text-xs text-gray-400 text-center">Need at least 2 named entries to spin.</p>
        </BentoCard>
      </div>

      <!-- Legend -->
      <BentoCard cls="text-xs text-gray-500">
        <CardHeader icon="bx-info-circle">How Weights Work</CardHeader>
        <p>Weight is relative. If Entry A has weight 2 and Entry B has weight 1, A is twice as likely to be picked. All weights are summed and each entry gets a proportional slice of the wheel.</p>
      </BentoCard>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import AppBtn     from '../components/ui/AppBtn.vue'
import { buildSegments, getColor, weightedPick } from '../utils/wheelRandomizer.js'

const canvas  = ref(null)
const entries = ref([])
const winner  = ref(null)
const spinning= ref(false)

function loadDefaults() {
  entries.value = [
    { label: 'Alice', weight: 1 }, { label: 'Bob', weight: 1 },
    { label: 'Carol', weight: 2 }, { label: 'Dave', weight: 1 },
    { label: 'Eve', weight: 1 },
  ]
  winner.value = null
  drawWheel(0)
}

function addEntry()    { entries.value.push({ label: '', weight: 1 }) }
function removeEntry(i){ entries.value.splice(i, 1); drawWheel(0) }

function drawWheel(rotation) {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  const valid = entries.value.filter(e => e.label.trim())
  if (valid.length === 0) { ctx.clearRect(0,0,280,280); return }

  const segs = buildSegments(valid)
  const cx = 140, cy = 140, r = 130
  ctx.clearRect(0, 0, 280, 280)

  segs.forEach((seg, i) => {
    const start = ((seg.start + rotation) * Math.PI) / 180 - Math.PI / 2
    const end   = start + (seg.sweep * Math.PI) / 180
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, start, end)
    ctx.closePath()
    ctx.fillStyle = getColor(i)
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()

    // Label
    const mid = start + (end - start) / 2
    const lx  = cx + (r * 0.65) * Math.cos(mid)
    const ly  = cy + (r * 0.65) * Math.sin(mid)
    ctx.save()
    ctx.translate(lx, ly)
    ctx.rotate(mid + Math.PI / 2)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 11px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const maxLen = 10
    ctx.fillText(seg.label.length > maxLen ? seg.label.slice(0, maxLen) + '…' : seg.label, 0, 0)
    ctx.restore()
  })

  // Center circle
  ctx.beginPath()
  ctx.arc(cx, cy, 18, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'
  ctx.fill()
  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 2
  ctx.stroke()
}

function spin() {
  const valid = entries.value.filter(e => e.label.trim())
  if (valid.length < 2 || spinning.value) return
  spinning.value = true
  winner.value = null

  const picked = weightedPick(valid)
  const segs   = buildSegments(valid)
  const seg    = segs.find(s => s.label === picked.label)
  const targetAngle = 360 * 5 + (360 - seg.start - seg.sweep / 2)

  let current = 0
  const duration = 3500
  const start = performance.now()

  function animate(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 4)
    current = targetAngle * ease
    drawWheel(current % 360)
    if (progress < 1) { requestAnimationFrame(animate) }
    else {
      spinning.value = false
      winner.value = picked
    }
  }
  requestAnimationFrame(animate)
}

onMounted(() => { loadDefaults() })
watch(entries, () => drawWheel(0), { deep: true })
</script>
