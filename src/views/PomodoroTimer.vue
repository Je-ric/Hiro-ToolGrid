<template>
  <ToolLayout title="Pomodoro Timer" subtitle="Focus deeply. Break intentionally. Track every session.">
    <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

      <!-- Timer center -->
      <div class="lg:col-span-2 flex flex-col gap-5">

        <!-- Mode tabs -->
        <div class="bg-white rounded-2xl shadow p-2 flex gap-2">
          <button v-for="(cfg, key) in MODES" :key="key" @click="setMode(key)"
            :class="['flex-1 py-2 rounded-xl text-sm font-semibold transition-colors',
              mode === key ? `${cfg.ring === '#f43f5e' ? 'bg-rose-500' : cfg.ring === '#10b981' ? 'bg-emerald-500' : 'bg-blue-500'} text-white` : 'text-gray-500 hover:bg-gray-50']">
            {{ cfg.label }}
          </button>
        </div>

        <!-- Ring timer -->
        <div :class="`bg-white rounded-2xl shadow p-8 flex flex-col items-center gap-6 transition-colors`">
          <div class="relative w-56 h-56">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 224 224">
              <circle cx="112" cy="112" r="100" fill="none" stroke="#f1f5f9" stroke-width="12"/>
              <circle cx="112" cy="112" r="100" fill="none"
                :stroke="currentMode.ring" stroke-width="12"
                stroke-linecap="round"
                :stroke-dasharray="628"
                :stroke-dashoffset="628 - (628 * progress / 100)"
                style="transition: stroke-dashoffset 1s linear;"/>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <p :class="`text-5xl font-bold ${currentMode.color}`">{{ display }}</p>
              <p class="text-sm text-gray-400 font-medium">{{ currentMode.label }}</p>
              <p v-if="activeTask" class="text-xs text-gray-400 max-w-32 text-center truncate">{{ activeTask }}</p>
            </div>
          </div>

          <!-- Controls -->
          <div class="flex gap-3 w-full max-w-xs">
            <button v-if="!running" @click="start"
              :class="`flex-1 py-3 rounded-xl font-bold text-white text-lg transition-colors ${currentMode.ring === '#f43f5e' ? 'bg-rose-500 hover:bg-rose-600' : currentMode.ring === '#10b981' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600'}`">
              ▶ Start
            </button>
            <button v-else @click="pause"
              class="flex-1 py-3 rounded-xl font-bold text-white text-lg bg-gray-500 hover:bg-gray-600 transition-colors">
              ⏸ Pause
            </button>
            <button @click="stop" class="px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors">
              ■
            </button>
            <button @click="skip" class="px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors" title="Skip">
              ⏭
            </button>
          </div>

          <!-- Cycle indicator -->
          <div class="flex items-center gap-2">
            <div v-for="i in settings.longAfter" :key="i"
              :class="['w-3 h-3 rounded-full transition-colors', i <= (cycle % settings.longAfter) ? 'bg-rose-500' : 'bg-gray-200']">
            </div>
            <span class="text-xs text-gray-400 ml-1">{{ cycle }} sessions completed</span>
          </div>
        </div>

        <!-- Task input -->
        <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
          <CardHeader icon="bx-task">Current Task</CardHeader>
          <div class="flex gap-2">
            <input v-model="activeTask" type="text" placeholder="What are you working on?"
              class="flex-1 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm" />
          </div>

          <!-- Task list -->
          <div v-if="tasks.length" class="flex flex-col gap-2 mt-1">
            <div v-for="task in tasks" :key="task.id"
              class="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 group">
              <button @click="toggleTask(task.id)"
                :class="['w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors',
                  task.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 hover:border-emerald-400']">
                <i v-if="task.done" class="bx bx-check text-xs"></i>
              </button>
              <span :class="['flex-1 text-sm', task.done ? 'line-through text-gray-400' : 'text-gray-700']"
                @click="activeTask = task.text">{{ task.text }}</span>
              <button @click="removeTask(task.id)" class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all">
                <i class="bx bx-x"></i>
              </button>
            </div>
          </div>

          <div class="flex gap-2">
            <input v-model="newTask" type="text" placeholder="Add a task..." @keydown.enter="addNewTask"
              class="flex-1 p-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm bg-gray-50" />
            <button @click="addNewTask" class="px-3 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors text-sm font-semibold">
              + Add
            </button>
          </div>
        </div>
      </div>

      <!-- Right panel: settings + sessions -->
      <div class="flex flex-col gap-5">

        <!-- Settings -->
        <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-4">
          <CardHeader icon="bx-cog">Settings</CardHeader>
          <div class="flex flex-col gap-3 text-sm">
            <div v-for="s in settingFields" :key="s.key" class="flex items-center justify-between gap-3">
              <label class="text-gray-600 flex-1">{{ s.label }}</label>
              <div class="flex items-center gap-1">
                <button @click="settings[s.key] = Math.max(s.min, settings[s.key] - 1); applySettings()"
                  class="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center">−</button>
                <span class="w-8 text-center font-semibold text-gray-800">{{ settings[s.key] }}</span>
                <button @click="settings[s.key] = Math.min(s.max, settings[s.key] + 1); applySettings()"
                  class="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center">+</button>
                <span class="text-gray-400 text-xs w-6">{{ s.unit }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Session log -->
        <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <CardHeader icon="bx-history">Session Log</CardHeader>
            <button v-if="sessions.length" @click="sessions.length = 0" class="text-xs text-gray-400 hover:text-red-400 transition-colors">Clear</button>
          </div>
          <div v-if="!sessions.length" class="text-sm text-gray-400 text-center py-4">No sessions yet. Start focusing!</div>
          <div v-else class="flex flex-col gap-2 max-h-64 overflow-y-auto">
            <div v-for="(s, i) in sessions" :key="i"
              class="flex items-start gap-2 p-2 bg-gray-50 rounded-xl text-sm">
              <div class="w-6 h-6 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {{ sessions.length - i }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-gray-700 font-medium truncate">{{ s.task }}</p>
                <p class="text-xs text-gray-400">{{ s.duration }}min · {{ s.completedAt }}</p>
              </div>
            </div>
          </div>
          <div v-if="sessions.length" class="pt-2 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
            <span>{{ sessions.length }} sessions</span>
            <span>{{ sessions.reduce((a, s) => a + s.duration, 0) }} min total</span>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import { usePomodoro } from '../composables/usePomodoro.js'

const {
  MODES, settings, mode, running, display, progress, currentMode, cycle, sessions, tasks, activeTask,
  setMode, start, pause, stop, skip, addTask, toggleTask, removeTask, applySettings,
} = usePomodoro()

const newTask = ref('')
function addNewTask() { addTask(newTask.value); newTask.value = '' }

const settingFields = [
  { key: 'focus',     label: 'Focus',       unit: 'min', min: 1,  max: 60 },
  { key: 'short',     label: 'Short Break', unit: 'min', min: 1,  max: 30 },
  { key: 'long',      label: 'Long Break',  unit: 'min', min: 1,  max: 60 },
  { key: 'longAfter', label: 'Long after',  unit: 'ses', min: 2,  max: 8  },
]
</script>
