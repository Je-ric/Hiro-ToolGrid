<template>
  <ToolLayout title="LED Binary Clock" subtitle="Each column of LEDs represents a digit in binary">
    <div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

      <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
        <h2 class="text-lg font-semibold text-gray-700 flex items-center gap-2"><i class="bx bx-info-circle text-yellow-500"></i> Columns</h2>
        <div class="flex flex-col gap-2 text-sm text-gray-600">
          <div class="bg-gray-50 rounded-xl p-3"><span class="font-semibold text-gray-800">H1 H2</span> — Hour tens &amp; ones</div>
          <div class="bg-gray-50 rounded-xl p-3"><span class="font-semibold text-gray-800">M1 M2</span> — Minute tens &amp; ones</div>
          <div class="bg-gray-50 rounded-xl p-3"><span class="font-semibold text-gray-800">S1 S2</span> — Second tens &amp; ones</div>
        </div>
        <div class="bg-yellow-50 rounded-xl p-3 text-sm text-yellow-700">
          <p class="font-semibold mb-1">🟡 ON &nbsp;⚫ OFF</p>
          <p class="font-light">Add up the ON bit values per column to get the digit.</p>
        </div>
      </div>

      <div class="bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6">
        <!-- Column headers -->
        <div class="flex items-center gap-3">
          <div class="w-8"></div>
          <div class="flex gap-2">
            <div class="w-10 text-center text-gray-400 text-xs font-bold">H1</div>
            <div class="w-10 text-center text-gray-400 text-xs font-bold">H2</div>
          </div>
          <div class="w-6 text-center text-gray-500 text-lg font-bold">:</div>
          <div class="flex gap-2">
            <div class="w-10 text-center text-gray-400 text-xs font-bold">M1</div>
            <div class="w-10 text-center text-gray-400 text-xs font-bold">M2</div>
          </div>
          <div class="w-6 text-center text-gray-500 text-lg font-bold">:</div>
          <div class="flex gap-2">
            <div class="w-10 text-center text-gray-400 text-xs font-bold">S1</div>
            <div class="w-10 text-center text-gray-400 text-xs font-bold">S2</div>
          </div>
        </div>

        <!-- LED rows -->
        <div class="flex flex-col gap-3">
          <div v-for="(row, ri) in 4" :key="ri" class="flex items-center gap-3">
            <div class="w-8 text-right text-gray-500 text-xs font-bold">{{ bitWeights[ri] }}</div>
            <div class="flex gap-2">
              <div v-for="ci in [0,1]" :key="ci" :class="`led w-10 h-10 rounded-full ${isOn(ci, ri) ? 'led-on' : 'led-off'}`"></div>
            </div>
            <div class="w-6"></div>
            <div class="flex gap-2">
              <div v-for="ci in [2,3]" :key="ci" :class="`led w-10 h-10 rounded-full ${isOn(ci, ri) ? 'led-on' : 'led-off'}`"></div>
            </div>
            <div class="w-6"></div>
            <div class="flex gap-2">
              <div v-for="ci in [4,5]" :key="ci" :class="`led w-10 h-10 rounded-full ${isOn(ci, ri) ? 'led-on' : 'led-off'}`"></div>
            </div>
          </div>
        </div>

        <!-- Digit labels -->
        <div class="flex items-center gap-3">
          <div class="w-8"></div>
          <div class="flex gap-2">
            <div class="w-10 text-center text-yellow-400 text-xl font-bold">{{ digits[0] }}</div>
            <div class="w-10 text-center text-yellow-400 text-xl font-bold">{{ digits[1] }}</div>
          </div>
          <div class="w-6 text-center text-yellow-400 text-xl font-bold">:</div>
          <div class="flex gap-2">
            <div class="w-10 text-center text-yellow-400 text-xl font-bold">{{ digits[2] }}</div>
            <div class="w-10 text-center text-yellow-400 text-xl font-bold">{{ digits[3] }}</div>
          </div>
          <div class="w-6 text-center text-yellow-400 text-xl font-bold">:</div>
          <div class="flex gap-2">
            <div class="w-10 text-center text-yellow-400 text-xl font-bold">{{ digits[4] }}</div>
            <div class="w-10 text-center text-yellow-400 text-xl font-bold">{{ digits[5] }}</div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
        <h2 class="text-lg font-semibold text-gray-700 flex items-center gap-2"><i class="bx bx-book-open text-yellow-500"></i> Rows</h2>
        <div class="flex flex-col gap-2 text-sm text-gray-600">
          <div class="bg-gray-50 rounded-xl p-3 flex justify-between"><span>Row 1 (top)</span><span class="font-bold text-gray-800">bit 8</span></div>
          <div class="bg-gray-50 rounded-xl p-3 flex justify-between"><span>Row 2</span><span class="font-bold text-gray-800">bit 4</span></div>
          <div class="bg-gray-50 rounded-xl p-3 flex justify-between"><span>Row 3</span><span class="font-bold text-gray-800">bit 2</span></div>
          <div class="bg-gray-50 rounded-xl p-3 flex justify-between"><span>Row 4 (bottom)</span><span class="font-bold text-gray-800">bit 1</span></div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'

const bitWeights = [8, 4, 2, 1]
const digits = ref([0,0,0,0,0,0])
const ledBits = ref(Array.from({length:6}, () => [0,0,0,0]))

function updateClock() {
  const now = new Date()
  const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds()
  const d = [Math.floor(h/10), h%10, Math.floor(m/10), m%10, Math.floor(s/10), s%10]
  digits.value = d
  ledBits.value = d.map(digit => {
    let n = digit
    return bitWeights.map(bw => { if (n >= bw) { n -= bw; return 1 } return 0 })
  })
}

function isOn(col, row) { return ledBits.value[col][row] === 1 }

let timer
onMounted(() => { updateClock(); timer = setInterval(updateClock, 1000) })
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.led { transition: background-color 0.2s, box-shadow 0.2s; }
.led-on  { background-color: #facc15; box-shadow: 0 0 10px 3px #facc15; }
.led-off { background-color: #374151; }
</style>
