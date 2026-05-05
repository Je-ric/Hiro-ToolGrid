<template>
  <ToolLayout title="Base64 Encoder / Decoder" subtitle="Encode text or images to Base64, or decode Base64 back to text.">
    <div class="w-full flex flex-col gap-5">

      <TabBar :tabs="tabs" :active="activeTab" @change="activeTab = $event; reset()" />

      <!-- Text Tab -->
      <div v-if="activeTab === 'text'" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BentoCard>
          <CardHeader icon="bx-text">Input</CardHeader>
          <p class="text-xs text-gray-400">Enter plain text to encode, or Base64 to decode.</p>
          <textarea v-model="textInput" class="w-full h-48 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Enter text or Base64..."></textarea>
          <div class="flex gap-2">
            <AppBtn @click="encode" icon="bx-right-arrow-alt">Encode →</AppBtn>
            <AppBtn variant="secondary" @click="decode" icon="bx-left-arrow-alt">← Decode</AppBtn>
            <AppBtn variant="ghost" @click="swapText" icon="bx-transfer">Swap</AppBtn>
          </div>
        </BentoCard>
        <BentoCard>
          <CardHeader icon="bx-code-alt">Output</CardHeader>
          <textarea :value="textOutput" readonly class="w-full h-48 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm resize-none focus:outline-none break-all"
            placeholder="Result appears here..."></textarea>
          <div v-if="error" class="text-sm text-red-500 flex items-center gap-1"><i class="bx bx-error-circle"></i> {{ error }}</div>
          <div class="flex gap-2">
            <button @click="copyOutput" class="flex-1 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600">
              {{ copied ? 'Copied!' : 'Copy Output' }}
            </button>
            <button @click="downloadOutput" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-sm hover:bg-gray-300">
              <i class="bx bx-download"></i>
            </button>
          </div>
        </BentoCard>
      </div>

      <!-- Image Tab -->
      <div v-if="activeTab === 'image'" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BentoCard>
          <CardHeader icon="bx-image">Image to Base64</CardHeader>
          <p class="text-xs text-gray-400">Upload an image to get its Base64 data URI. Useful for embedding images directly in HTML/CSS without a separate file request.</p>
          <label class="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors">
            <i class="bx bx-upload text-3xl text-gray-400"></i>
            <span class="text-sm text-gray-400 mt-1">Click to upload image</span>
            <input type="file" accept="image/*" class="hidden" @change="onImageUpload" />
          </label>
          <div v-if="imgPreview" class="flex flex-col gap-2">
            <img :src="imgPreview" class="max-h-32 rounded-xl object-contain border border-gray-200" />
            <p class="text-xs text-gray-400">Size: {{ imgSize }}</p>
          </div>
        </BentoCard>
        <BentoCard>
          <CardHeader icon="bx-code-alt">Base64 Output</CardHeader>
          <textarea :value="imgBase64" readonly class="w-full h-48 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs resize-none focus:outline-none break-all"
            placeholder="Base64 data URI appears here..."></textarea>
          <div class="flex gap-2">
            <button @click="copyImg" class="flex-1 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600">
              {{ copiedImg ? 'Copied!' : 'Copy Base64' }}
            </button>
          </div>
        </BentoCard>
      </div>

      <!-- Decode Image Tab -->
      <div v-if="activeTab === 'decode-img'" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BentoCard>
          <CardHeader icon="bx-code-alt">Paste Base64 Data URI</CardHeader>
          <p class="text-xs text-gray-400">Paste a Base64 data URI (e.g. <code>data:image/png;base64,...</code>) to preview the image.</p>
          <textarea v-model="decodeImgInput" class="w-full h-48 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="data:image/png;base64,..."></textarea>
          <AppBtn @click="previewDecoded" icon="bx-show">Preview Image</AppBtn>
        </BentoCard>
        <BentoCard>
          <CardHeader icon="bx-image">Preview</CardHeader>
          <div v-if="decodedImgSrc" class="flex flex-col gap-2">
            <img :src="decodedImgSrc" class="max-h-48 rounded-xl object-contain border border-gray-200" />
            <a :href="decodedImgSrc" download="decoded-image" class="self-start px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600">
              <i class="bx bx-download"></i> Download
            </a>
          </div>
          <div v-else class="text-sm text-gray-400 italic">Paste a valid Base64 data URI and click Preview.</div>
          <div v-if="decodeImgError" class="text-sm text-red-500">{{ decodeImgError }}</div>
        </BentoCard>
      </div>

      <!-- Legend -->
      <BentoCard cls="text-xs text-gray-500">
        <CardHeader icon="bx-info-circle">What is Base64?</CardHeader>
        <p>Base64 encodes binary data as ASCII text using 64 characters (A–Z, a–z, 0–9, +, /). It increases size by ~33% but allows binary data to be safely transmitted in text-only contexts like JSON, HTML attributes, CSS, and email.</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
          <div><strong class="text-gray-700">Encode</strong> — Plain text → Base64 string</div>
          <div><strong class="text-gray-700">Decode</strong> — Base64 string → Plain text</div>
          <div><strong class="text-gray-700">Image</strong> — Binary image → data URI for embedding</div>
        </div>
      </BentoCard>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import AppBtn     from '../components/ui/AppBtn.vue'
import TabBar     from '../components/ui/TabBar.vue'

const tabs = [
  { id: 'text',       label: 'Text Encode/Decode' },
  { id: 'image',      label: 'Image → Base64' },
  { id: 'decode-img', label: 'Base64 → Image' },
]
const activeTab = ref('text')

// Text
const textInput  = ref('')
const textOutput = ref('')
const error      = ref('')
const copied     = ref(false)

function encode() {
  error.value = ''
  try { textOutput.value = btoa(unescape(encodeURIComponent(textInput.value))) }
  catch { error.value = 'Encoding failed.' }
}
function decode() {
  error.value = ''
  try { textOutput.value = decodeURIComponent(escape(atob(textInput.value.trim()))) }
  catch { error.value = 'Invalid Base64 string.' }
}
function swapText() { textInput.value = textOutput.value; textOutput.value = '' }
function copyOutput() {
  if (!textOutput.value) return
  navigator.clipboard.writeText(textOutput.value)
  copied.value = true; setTimeout(() => copied.value = false, 2000)
}
function downloadOutput() {
  if (!textOutput.value) return
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([textOutput.value], { type: 'text/plain' }))
  a.download = 'base64-output.txt'; a.click()
}

// Image encode
const imgPreview = ref('')
const imgBase64  = ref('')
const imgSize    = ref('')
const copiedImg  = ref(false)

function onImageUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  imgSize.value = (file.size / 1024).toFixed(1) + ' KB'
  const reader = new FileReader()
  reader.onload = ev => {
    imgPreview.value = ev.target.result
    imgBase64.value  = ev.target.result
  }
  reader.readAsDataURL(file)
}
function copyImg() {
  if (!imgBase64.value) return
  navigator.clipboard.writeText(imgBase64.value)
  copiedImg.value = true; setTimeout(() => copiedImg.value = false, 2000)
}

// Image decode
const decodeImgInput = ref('')
const decodedImgSrc  = ref('')
const decodeImgError = ref('')

function previewDecoded() {
  decodeImgError.value = ''
  const val = decodeImgInput.value.trim()
  if (!val.startsWith('data:image')) {
    decodeImgError.value = 'Must be a valid data URI starting with data:image/...'
    return
  }
  decodedImgSrc.value = val
}

function reset() {
  textInput.value = ''; textOutput.value = ''; error.value = ''
  imgPreview.value = ''; imgBase64.value = ''
  decodeImgInput.value = ''; decodedImgSrc.value = ''; decodeImgError.value = ''
}
</script>
