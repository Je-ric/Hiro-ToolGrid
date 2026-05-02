<template>
  <ToolLayout title="QR Code Generator" subtitle="Generate and download QR codes for any text, URL, or data">
    <div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div class="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="font-medium text-gray-700">Text or URL</label>
          <textarea v-model="qrInput" placeholder="Enter text, URL, email, phone..."
            class="w-full h-28 p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">Size</label>
            <select v-model="qrSize" class="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm">
              <option value="128">Small (128px)</option>
              <option value="200">Medium (200px)</option>
              <option value="300">Large (300px)</option>
              <option value="400">XL (400px)</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">Error Correction</label>
            <select v-model="qrLevel" class="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm">
              <option value="L">L — Low (7%)</option>
              <option value="M">M — Medium (15%)</option>
              <option value="Q">Q — Quartile (25%)</option>
              <option value="H">H — High (30%)</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">Dark Color</label>
            <input type="color" v-model="darkColor" class="w-full h-10 border border-gray-300 rounded cursor-pointer" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-600">Light Color</label>
            <input type="color" v-model="lightColor" class="w-full h-10 border border-gray-300 rounded cursor-pointer" />
          </div>
        </div>
        <div class="flex gap-3">
          <button @click="generateQR" class="flex-1 bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition-colors">Generate</button>
          <button v-if="hasQR" @click="downloadQR" class="flex-1 bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600 transition-colors">Download</button>
          <button @click="clearQR" class="flex-1 bg-gray-300 text-gray-800 font-semibold py-2 rounded hover:bg-gray-400 transition-colors">Clear</button>
        </div>
        <ErrorBox :message="error" />
      </div>

      <div class="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-4">
        <h2 class="text-lg font-bold text-gray-700 self-start">QR Code</h2>
        <div v-if="!hasQR" class="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 text-sm text-center p-4">
          Your QR code will appear here
        </div>
        <div v-else class="flex flex-col items-center gap-3">
          <div ref="qrCanvas"></div>
          <p class="text-xs text-gray-400">{{ qrInput.length }} characters</p>
        </div>
      </div>
    </div>

    <div class="w-full max-w-5xl bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
      <h2 class="text-lg font-bold text-gray-700">Quick Presets</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <button v-for="p in presets" :key="p.type" @click="qrInput = p.value"
          class="bg-gray-50 border rounded-lg p-3 text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition text-left">
          <div class="font-semibold">{{ p.icon }} {{ p.label }}</div>
          <div class="text-xs text-gray-400">{{ p.value }}</div>
        </button>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import ErrorBox from '../components/ui/ErrorBox.vue'

const qrInput = ref(''), qrSize = ref('200'), qrLevel = ref('M')
const darkColor = ref('#000000'), lightColor = ref('#ffffff')
const error = ref(''), hasQR = ref(false)
const qrCanvas = ref(null)
let qrInstance = null

const presets = [
  { type:'url',   label:'URL',        icon:'🌐', value:'https://example.com' },
  { type:'email', label:'Email',      icon:'📧', value:'mailto:you@email.com' },
  { type:'phone', label:'Phone',      icon:'📞', value:'tel:+1234567890' },
  { type:'sms',   label:'SMS',        icon:'💬', value:'sms:+1234567890?body=Hello' },
  { type:'wifi',  label:'WiFi',       icon:'📶', value:'WIFI:S:MyNetwork;T:WPA;P:mypassword;;' },
  { type:'text',  label:'Plain Text', icon:'📝', value:'Hello, World!' },
]

const levelMap = { L: QRCode.CorrectLevel.L, M: QRCode.CorrectLevel.M, Q: QRCode.CorrectLevel.Q, H: QRCode.CorrectLevel.H }

async function generateQR() {
  error.value = ''
  if (!qrInput.value.trim()) { error.value = 'Please enter some text or a URL.'; return }
  hasQR.value = true
  await nextTick()
  if (qrInstance) { qrInstance.clear(); qrInstance = null }
  qrCanvas.value.innerHTML = ''
  qrInstance = new QRCode(qrCanvas.value, {
    text: qrInput.value.trim(),
    width: parseInt(qrSize.value),
    height: parseInt(qrSize.value),
    colorDark: darkColor.value,
    colorLight: lightColor.value,
    correctLevel: levelMap[qrLevel.value]
  })
}

function downloadQR() {
  const canvas = qrCanvas.value?.querySelector('canvas')
  const img    = qrCanvas.value?.querySelector('img')
  const link   = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = canvas ? canvas.toDataURL('image/png') : img?.src
  link.click()
}

function clearQR() {
  qrInput.value = ''; error.value = ''; hasQR.value = false
  if (qrInstance) { qrInstance.clear(); qrInstance = null }
}
</script>
