<template>
  <div class="bg-gray-100 min-h-screen p-6 md:p-10">
    <div class="max-w-6xl mx-auto mb-10 text-center">
      <p class="text-blue-500 font-medium tracking-widest text-sm uppercase mb-2">Vanilla Frontend</p>
      <h1 class="text-5xl font-bold text-gray-800">Small Projects</h1>
      <p class="text-gray-400 mt-2 text-lg font-light">A collection of interactive mini-tools built with HTML, Tailwind & Vanilla JS</p>
    </div>

    <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <router-link v-for="tool in tools" :key="tool.path" :to="tool.path"
        class="card-hover bg-white rounded-2xl shadow p-5 flex flex-col gap-3 group">
        <div :class="`w-12 h-12 rounded-xl ${tool.iconBg} flex items-center justify-center ${tool.iconColor} text-2xl`">
          <i :class="`bx ${tool.icon}`"></i>
        </div>
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-widest">{{ tool.num }}</p>
          <h2 class="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{{ tool.title }}</h2>
          <p class="text-sm text-gray-400 font-light mt-1">{{ tool.desc }}</p>
        </div>
        <div class="mt-auto flex items-center gap-1 text-blue-500 text-sm font-medium">Open <i class="bx bx-right-arrow-alt"></i></div>
      </router-link>
    </div>

    <p class="text-center text-gray-400 text-sm mt-12 font-light">Vanilla Frontend — Small Projects Collection</p>
  </div>
</template>

<script setup>
const tools = [
  { num: '01', path: '/direction-indicator', title: 'Direction Indicator', desc: 'Hover over a compass grid to detect direction zones.', icon: 'bx-compass', iconBg: 'bg-red-100', iconColor: 'text-red-500' },
  { num: '02', path: '/password-generator', title: 'Password Generator', desc: 'Generate secure passwords and PINs with custom options.', icon: 'bx-lock-alt', iconBg: 'bg-blue-100', iconColor: 'text-blue-500' },
  { num: '03', path: '/text-analyzer', title: 'Text Analyzer', desc: 'Count words, characters, letters, numbers, and spaces.', icon: 'bx-text', iconBg: 'bg-green-100', iconColor: 'text-green-500' },
  { num: '04', path: '/roman-numerals', title: 'Roman Numerals', desc: 'Convert between Roman numerals and decimal numbers.', icon: 'bx-font', iconBg: 'bg-purple-100', iconColor: 'text-purple-500' },
  { num: '06', path: '/currency-converter', title: 'Currency Converter', desc: 'Live exchange rates between world currencies.', icon: 'bx-dollar-circle', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-500' },
  { num: '07', path: '/measure-converter', title: 'Measure Converter', desc: 'Convert length, weight, temp, area, volume, speed & more.', icon: 'bx-ruler', iconBg: 'bg-teal-100', iconColor: 'text-teal-500' },
  { num: '08', path: '/led-clock', title: 'LED Binary Clock', desc: 'A live clock that displays time in binary using LED dots.', icon: 'bx-time', iconBg: 'bg-gray-800', iconColor: 'text-yellow-400' },
  { num: '09', path: '/binary-decimal-hex', title: 'Binary / Decimal / Hex', desc: 'Convert between base 2, base 10, and base 16.', icon: 'bx-code-alt', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-500' },
  { num: '10', path: '/logic-gate', title: 'Logic Gate Simulator', desc: 'Toggle A & B inputs and see AND, OR, NOT, XOR and more.', icon: 'bx-chip', iconBg: 'bg-orange-100', iconColor: 'text-orange-500' },
  { num: '11', path: '/dummy-data', title: 'Dummy Data Generator', desc: 'Generate Lorem Ipsum, names, emails, phones, dates & colors.', icon: 'bx-paragraph', iconBg: 'bg-pink-100', iconColor: 'text-pink-500' },
  { num: '12', path: '/qr-code', title: 'QR Code Generator', desc: 'Generate and download QR codes for any text or URL.', icon: 'bx-qr', iconBg: 'bg-gray-100', iconColor: 'text-gray-600' },
  { num: '13', path: '/age-calculator', title: 'Age Calculator', desc: 'Calculate exact age in years, months, weeks, days & hours.', icon: 'bx-calendar-heart', iconBg: 'bg-rose-100', iconColor: 'text-rose-500' },
  { num: '14', path: '/json-converter', title: 'JSON ↔ Table / CSV', desc: 'Convert JSON arrays to tables or CSV, and CSV back to JSON.', icon: 'bx-table', iconBg: 'bg-cyan-100', iconColor: 'text-cyan-500' },
]
</script>

<style scoped>
.card-hover { transition: transform 0.2s, box-shadow 0.2s; }
.card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); }
</style>
