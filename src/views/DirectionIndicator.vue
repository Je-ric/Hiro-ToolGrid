<template>
  <ToolLayout title="Direction Indicator" subtitle="Hover or click a zone on the compass to detect direction">
    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-5">

      <!-- Legend -->
      <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-4">
        <h2 class="text-lg font-semibold text-gray-700 flex items-center gap-2"><i class="bx bx-info-circle text-blue-500"></i> Directions</h2>
        <div class="grid grid-cols-3 gap-2 text-center text-sm">
          <div v-for="d in ['NW','N','NE','W','C','E','SW','S','SE']" :key="d"
            :class="`rounded-lg p-2 font-medium ${d === 'C' ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-600'}`">{{ d }}</div>
        </div>
        <p class="text-xs text-gray-400 font-light">Hover over any zone on the compass to highlight it.</p>
      </div>

      <!-- Compass -->
      <div class="flex flex-col items-center justify-center gap-4">
        <div class="compass relative w-72 h-72 rounded-2xl bg-slate-700 overflow-hidden shadow-xl">
          <div v-for="zone in zones" :key="zone.dir"
            :class="`direction-area ${zone.pos}`"
            @mouseenter="onEnter(zone.dir)"
            @mouseleave="onLeave">
            {{ zone.dir }}
          </div>
        </div>
      </div>

      <!-- Active display -->
      <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-4 justify-between">
        <h2 class="text-lg font-semibold text-gray-700 flex items-center gap-2"><i class="bx bx-compass text-blue-500"></i> Active Zone</h2>
        <div class="flex-1 flex flex-col items-center justify-center gap-3">
          <div :class="`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold transition-all ${active ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-300'}`">
            {{ active || '—' }}
          </div>
          <p class="text-gray-400 text-sm font-light">{{ active ? fullNames[active] : 'Hover a zone' }}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-3 text-sm text-gray-500 font-light">
          <p class="font-medium text-gray-700 mb-1">Last 5 hovered:</p>
          <p class="text-gray-400 tracking-widest">{{ history.length ? history.join(' · ') : '—' }}</p>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'

const active = ref('')
const history = ref([])

const fullNames = { N:'North', S:'South', E:'East', W:'West', NE:'North-East', NW:'North-West', SE:'South-East', SW:'South-West', C:'Center' }

const zones = [
  { dir:'NW', pos:'nw' }, { dir:'N', pos:'n' }, { dir:'NE', pos:'ne' },
  { dir:'W',  pos:'w'  }, { dir:'C', pos:'center' }, { dir:'E', pos:'e' },
  { dir:'SW', pos:'sw' }, { dir:'S', pos:'s' }, { dir:'SE', pos:'se' },
]

function onEnter(dir) {
  active.value = dir
  history.value.push(dir)
  if (history.value.length > 5) history.value.shift()
}
function onLeave() { active.value = '' }
</script>

<style scoped>
.direction-area { position:absolute; width:33.33%; height:33.33%; display:flex; justify-content:center; align-items:center; color:white; font-weight:600; font-size:14px; transition:background-color 0.2s; cursor:pointer; letter-spacing:1px; }
.direction-area:hover { background-color:#3b82f6; z-index:10; }
.nw { top:0; left:0; } .n { top:0; left:33.33%; } .ne { top:0; right:0; }
.w  { top:33.33%; left:0; } .center { top:33.33%; left:33.33%; background-color:#334155; }
.e  { top:33.33%; right:0; }
.sw { bottom:0; left:0; } .s { bottom:0; left:33.33%; } .se { bottom:0; right:0; }
.compass::before, .compass::after { content:''; position:absolute; background-color:rgba(255,255,255,0.08); }
.compass::before { width:100%; height:1px; top:33.33%; left:0; box-shadow:0 100px 0 rgba(255,255,255,0.08); }
.compass::after  { height:100%; width:1px; left:33.33%; top:0; box-shadow:100px 0 0 rgba(255,255,255,0.08); }
</style>
