<template>
  <ToolLayout title="Base64 Encoder / Decoder" subtitle="Encode text or images to Base64, or decode Base64 back to text">

    <TabBar :tabs="tabs" :active="activeTab" @change="activeTab = $event; reset()" />

    <!-- Text tab -->
    <div v-if="activeTab === 'text'" class="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
      <BentoCard :emphasis="true" :stretch="true">
        <CardHeader icon="bx-text">Input</CardHeader>
        <p class="text-xs" style="color:var(--text-faint)">Enter plain text to encode, or a Base64 string to decode.</p>
        <textarea v-model="textInput" class="tg-input tg-mono w-full resize-none text-sm" style="min-height:180px"
          placeholder="Enter text or Base64…"></textarea>
        <div class="flex gap-2">
          <AppBtn @click="encode" icon="bx-right-arrow-alt" :full="true">Encode →</AppBtn>
          <AppBtn variant="secondary" @click="decode" icon="bx-left-arrow-alt" :full="true">← Decode</AppBtn>
          <AppBtn variant="ghost" icon="bx-transfer" @click="swapText">Swap</AppBtn>
        </div>
      </BentoCard>
      <BentoCard :stretch="true">
        <CardHeader icon="bx-code-alt" icon-color="#0d9488">Output</CardHeader>
        <p class="text-xs" style="color:var(--text-faint)">Result appears here.</p>
        <textarea :value="textOutput" readonly class="tg-input tg-mono w-full resize-none text-sm break-all" style="min-height:180px"
          placeholder="Result appears here…"></textarea>
        <ErrorBox :message="error" />
        <div class="flex gap-2">
          <AppBtn variant="copy" icon="bx-copy" :full="true" @click="copyOutput">{{ copied ? 'Copied!' : 'Copy Output' }}</AppBtn>
          <AppBtn variant="download" icon="bx-download" @click="downloadOutput">Save</AppBtn>
        </div>
      </BentoCard>
    </div>

    <!-- Image → Base64 tab -->
    <div v-if="activeTab === 'image'" class="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
      <BentoCard :emphasis="true">
        <CardHeader icon="bx-image">Upload Image</CardHeader>
        <p class="text-xs" style="color:var(--text-faint)">Upload any image to get its Base64 data URI — useful for embedding images in HTML/CSS without a separate file.</p>
        <label class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-colors py-8"
          style="border-color:var(--border-accent);background:var(--accent-bg)"
          onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border-accent)'">
          <i class="bx bx-upload text-3xl mb-2" style="color:var(--accent)"></i>
          <span class="text-sm font-medium" style="color:var(--accent)">Click to upload image</span>
          <span class="text-xs mt-1" style="color:var(--text-faint)">PNG, JPG, GIF, SVG…</span>
          <input type="file" accept="image/*" class="hidden" @change="onImageUpload" />
        </label>
        <div v-if="imgPreview" class="flex flex-col gap-2">
          <img :src="imgPreview" class="max-h-32 rounded-xl object-contain border" style="border-color:var(--border)" />
          <p class="text-xs" style="color:var(--text-faint)">Size: {{ imgSize }}</p>
        </div>
      </BentoCard>
      <BentoCard>
        <CardHeader icon="bx-code-alt" icon-color="#0d9488">Base64 Output</CardHeader>
        <p class="text-xs" style="color:var(--text-faint)">Copy this data URI and paste it into an <code>src</code> or <code>url()</code> attribute.</p>
        <textarea :value="imgBase64" readonly class="tg-input tg-mono w-full resize-none text-xs break-all" style="min-height:180px"
          placeholder="Base64 data URI appears here…"></textarea>
        <AppBtn variant="copy" icon="bx-copy" :full="true" @click="copyImg">{{ copiedImg ? 'Copied!' : 'Copy Base64' }}</AppBtn>
      </BentoCard>
    </div>

    <!-- Base64 → Image tab -->
    <div v-if="activeTab === 'decode-img'" class="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
      <BentoCard :emphasis="true">
        <CardHeader icon="bx-code-alt">Paste Base64 Data URI</CardHeader>
        <p class="text-xs" style="color:var(--text-faint)">Paste a Base64 data URI (starts with <code>data:image/…</code>) to preview and download the image.</p>
        <textarea v-model="decodeImgInput" class="tg-input tg-mono w-full resize-none text-xs" style="min-height:180px"
          placeholder="data:image/png;base64,…"></textarea>
        <AppBtn @click="previewDecoded" icon="bx-show" :full="true">Preview Image</AppBtn>
        <ErrorBox :message="decodeImgError" />
      </BentoCard>
      <BentoCard>
        <CardHeader icon="bx-image" icon-color="#0d9488">Preview</CardHeader>
        <div v-if="decodedImgSrc" class="flex flex-col gap-3">
          <img :src="decodedImgSrc" class="max-h-48 rounded-xl object-contain border" style="border-color:var(--border)" />
          <a :href="decodedImgSrc" download="decoded-image" class="tg-btn tg-btn-download tg-btn-full">
            <i class="bx bx-download"></i> Download Image
          </a>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-12 text-sm" style="color:var(--text-faint)">
          <i class="bx bx-image text-4xl mb-2" style="color:var(--border-accent)"></i>
          Paste a Base64 data URI and click Preview
        </div>
      </BentoCard>
    </div>

    <template #legend>
      <div class="flex flex-col gap-2 text-xs" style="color:var(--text-muted)">
        <p class="font-semibold" style="color:var(--text-base)">What is Base64?</p>
        <p>Encodes binary data as ASCII text using 64 characters. Increases size ~33% but works anywhere text is accepted.</p>
        <div class="tg-divider"></div>
        <div><strong style="color:var(--text-base)">Encode</strong> — text → Base64 string</div>
        <div><strong style="color:var(--text-base)">Decode</strong> — Base64 → original text</div>
        <div><strong style="color:var(--text-base)">Image</strong> — image file → data URI</div>
        <div class="tg-divider"></div>
        <p style="color:var(--text-faint)">Common uses: embedding images in HTML/CSS, JSON payloads, email attachments.</p>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import AppBtn     from '../components/ui/AppBtn.vue'
import TabBar     from '../components/ui/TabBar.vue'
import ErrorBox   from '../components/ui/ErrorBox.vue'

const tabs = [
  { id: 'text',       label: 'Text Encode / Decode' },
  { id: 'image',      label: 'Image → Base64' },
  { id: 'decode-img', label: 'Base64 → Image' },
]
const activeTab = ref('text')

const textInput = ref(''), textOutput = ref(''), error = ref(''), copied = ref(false)
function encode() { error.value=''; try { textOutput.value = btoa(unescape(encodeURIComponent(textInput.value))) } catch { error.value='Encoding failed.' } }
function decode() { error.value=''; try { textOutput.value = decodeURIComponent(escape(atob(textInput.value.trim()))) } catch { error.value='Invalid Base64 string.' } }
function swapText() { textInput.value = textOutput.value; textOutput.value = '' }
function copyOutput() { if (!textOutput.value) return; navigator.clipboard.writeText(textOutput.value); copied.value=true; setTimeout(()=>copied.value=false,2000) }
function downloadOutput() { if (!textOutput.value) return; const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([textOutput.value],{type:'text/plain'})); a.download='base64-output.txt'; a.click() }

const imgPreview=ref(''), imgBase64=ref(''), imgSize=ref(''), copiedImg=ref(false)
function onImageUpload(e) { const f=e.target.files[0]; if(!f)return; imgSize.value=(f.size/1024).toFixed(1)+' KB'; const r=new FileReader(); r.onload=ev=>{imgPreview.value=ev.target.result;imgBase64.value=ev.target.result}; r.readAsDataURL(f) }
function copyImg() { if(!imgBase64.value)return; navigator.clipboard.writeText(imgBase64.value); copiedImg.value=true; setTimeout(()=>copiedImg.value=false,2000) }

const decodeImgInput=ref(''), decodedImgSrc=ref(''), decodeImgError=ref('')
function previewDecoded() { decodeImgError.value=''; const v=decodeImgInput.value.trim(); if(!v.startsWith('data:image')){decodeImgError.value='Must start with data:image/…'; return}; decodedImgSrc.value=v }

function reset() { textInput.value=''; textOutput.value=''; error.value=''; imgPreview.value=''; imgBase64.value=''; decodeImgInput.value=''; decodedImgSrc.value=''; decodeImgError.value='' }
</script>
