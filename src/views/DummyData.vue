<template>
  <ToolLayout title="Dummy Data Generator" subtitle="Generate Lorem Ipsum text and fake data for prototyping" max-w="max-w-2xl">

    <TabBar :tabs="tabs" :active="activeTab" @change="setTab" />

    <BentoCard cls="w-full max-w-2xl" gap="4">
      <template v-if="activeTab === 'lorem'">
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">Type</label>
            <select v-model="loremType" class="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm">
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">Count</label>
            <input v-model.number="loremCount" type="number" min="1" max="20"
              class="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-600">How many to generate</label>
          <input v-model.number="otherCount" type="number" min="1" max="50"
            class="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
        </div>
      </template>
      <div class="flex gap-3">
        <AppBtn @click="generate">Generate</AppBtn>
        <AppBtn variant="green" icon="bx-copy" @click="copy(output)">{{ copied ? 'Copied!' : 'Copy' }}</AppBtn>
        <AppBtn variant="ghost" icon="bx-x" @click="output = ''">Clear</AppBtn>
      </div>
    </BentoCard>

    <BentoCard cls="w-full max-w-2xl" gap="3">
      <h2 class="text-lg font-bold text-gray-700">Output</h2>
      <textarea :value="output" readonly placeholder="Generated content will appear here..."
        class="w-full h-64 p-3 border border-gray-300 rounded resize-none focus:outline-none text-sm text-gray-700 bg-gray-50 font-mono"></textarea>
    </BentoCard>

  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout  from '../components/layouts/ToolLayout.vue'
import BentoCard   from '../components/ui/BentoCard.vue'
import AppBtn      from '../components/ui/AppBtn.vue'
import TabBar      from '../components/ui/TabBar.vue'
import { useClipboard } from '../composables/useClipboard.js'
import { useTabBar }    from '../composables/useTabBar.js'
import { generateLorem, generateName, generateEmail, generatePhone, generateDate, generateColor } from '../utils/dummyData.js'

const tabs = [
  { id:'lorem', label:'Lorem Ipsum' }, { id:'names', label:'Names' }, { id:'emails', label:'Emails' },
  { id:'phones', label:'Phone Numbers' }, { id:'dates', label:'Dates' }, { id:'colors', label:'Colors' },
]

const { activeTab, setTab } = useTabBar(tabs, 'lorem')
const { copied, copy } = useClipboard()
const loremType = ref('paragraphs'), loremCount = ref(3), otherCount = ref(5)
const output = ref('')

const generators = {
  names:  generateName,
  emails: generateEmail,
  phones: generatePhone,
  dates:  generateDate,
  colors: generateColor,
}

function generate() {
  if (activeTab.value === 'lorem') {
    output.value = generateLorem(loremType.value, loremCount.value)
  } else {
    const fn = generators[activeTab.value]
    output.value = Array.from({ length: Math.max(1, otherCount.value) }, fn).join('\n')
  }
}
</script>
