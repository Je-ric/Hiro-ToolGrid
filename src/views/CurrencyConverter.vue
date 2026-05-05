<template>
  <ToolLayout title="Currency Converter" subtitle="Live exchange rates powered by ExchangeRate-API">

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

      <!-- Quick rates -->
      <BentoCard>
        <CardHeader icon="bx-trending-up" icon-color="text-teal-500">Quick Pairs</CardHeader>
        <p class="text-xs text-slate-400">Click to load into converter</p>
        <div class="flex flex-col gap-1.5">
          <button v-for="q in quickPairs" :key="q.from+q.to" @click="setQuick(q.from, q.to)"
            class="flex justify-between items-center px-3 py-2.5 rounded-xl border border-cyan-100 bg-cyan-50/50 hover:bg-cyan-100 hover:border-cyan-300 transition-all text-sm group">
            <span class="font-semibold text-slate-600">{{ q.from }} <span class="text-cyan-400">→</span> {{ q.to }}</span>
            <i class="bx bx-right-arrow-alt text-slate-300 group-hover:text-cyan-500 transition-colors"></i>
          </button>
        </div>
      </BentoCard>

      <!-- Converter -->
      <BentoCard cls="lg:col-span-2" :emphasis="true">
        <CardHeader icon="bx-dollar-circle" icon-color="text-cyan-500">Converter</CardHeader>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</label>
          <input v-model="amount" type="text" class="tg-input text-xl font-semibold" />
        </div>

        <div class="grid grid-cols-5 gap-3 items-end">
          <div class="col-span-2 flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">From</label>
            <div class="flex items-center tg-input gap-2 p-0 overflow-hidden">
              <img :src="`https://flagcdn.com/48x36/${flagCode(fromCurrency)}.png`" class="w-6 h-4 object-cover rounded-sm ml-2.5 shrink-0" />
              <select v-model="fromCurrency" class="flex-1 bg-transparent outline-none text-sm py-2 pr-2">
                <option v-for="code in currencyCodes" :key="code" :value="code">{{ code }}</option>
              </select>
            </div>
          </div>

          <div class="flex justify-center pb-0.5">
            <button @click="swapCurrencies" class="tg-btn tg-btn-primary w-10 h-10 p-0 rounded-xl text-lg">
              <i class="bx bx-transfer"></i>
            </button>
          </div>

          <div class="col-span-2 flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">To</label>
            <div class="flex items-center tg-input gap-2 p-0 overflow-hidden">
              <img :src="`https://flagcdn.com/48x36/${flagCode(toCurrency)}.png`" class="w-6 h-4 object-cover rounded-sm ml-2.5 shrink-0" />
              <select v-model="toCurrency" class="flex-1 bg-transparent outline-none text-sm py-2 pr-2">
                <option v-for="code in currencyCodes" :key="code" :value="code">{{ code }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="tg-result text-xl">{{ resultText }}</div>

        <AppBtn @click="getRate" icon="bx-refresh" cls="w-full">Get Exchange Rate</AppBtn>
      </BentoCard>
    </div>

    <template #legend>
      <div class="flex flex-col gap-2 text-xs text-slate-500">
        <p><strong class="text-slate-600">Live rates</strong> — fetched from ExchangeRate-API on each request.</p>
        <div class="tg-divider"></div>
        <p class="text-[10px] text-slate-400">Rates update daily. For real-time trading, use a dedicated financial API.</p>
        <div class="tg-divider"></div>
        <div class="flex flex-col gap-1">
          <p class="font-semibold text-slate-600 text-[11px]">Quick pairs</p>
          <div v-for="q in quickPairs" :key="q.from+q.to" class="text-[11px] font-mono text-cyan-600">
            {{ q.from }} → {{ q.to }}
          </div>
        </div>
      </div>
    </template>
  </ToolLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'
import BentoCard  from '../components/ui/BentoCard.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import AppBtn     from '../components/ui/AppBtn.vue'

const API_KEY = 'e759f92560e41c99ee6213a2'
const countryList = { AED:'AE',AFN:'AF',XCD:'AG',ALL:'AL',AMD:'AM',ANG:'AN',AOA:'AO',ARS:'AR',AUD:'AU',AZN:'AZ',BAM:'BA',BBD:'BB',BDT:'BD',XOF:'BE',BGN:'BG',BHD:'BH',BIF:'BI',BMD:'BM',BND:'BN',BOB:'BO',BRL:'BR',BSD:'BS',NOK:'BV',BWP:'BW',BYR:'BY',BZD:'BZ',CAD:'CA',CDF:'CD',XAF:'CF',CHF:'CH',CLP:'CL',CNY:'CN',COP:'CO',CRC:'CR',CUP:'CU',CVE:'CV',CZK:'CZ',DJF:'DJ',DKK:'DK',DOP:'DO',DZD:'DZ',EGP:'EG',ETB:'ET',EUR:'FR',FJD:'FJ',FKP:'FK',GBP:'GB',GEL:'GE',GHS:'GH',GIP:'GI',GMD:'GM',GNF:'GN',GTQ:'GT',GYD:'GY',HKD:'HK',HNL:'HN',HRK:'HR',HTG:'HT',HUF:'HU',IDR:'ID',ILS:'IL',INR:'IN',IQD:'IQ',IRR:'IR',ISK:'IS',JMD:'JM',JOD:'JO',JPY:'JP',KES:'KE',KGS:'KG',KHR:'KH',KMF:'KM',KPW:'KP',KRW:'KR',KWD:'KW',KYD:'KY',KZT:'KZ',LAK:'LA',LBP:'LB',LKR:'LK',LRD:'LR',LYD:'LY',MAD:'MA',MDL:'MD',MGA:'MG',MKD:'MK',MMK:'MM',MNT:'MN',MUR:'MU',MVR:'MV',MWK:'MW',MXN:'MX',MYR:'MY',MZN:'MZ',NAD:'NA',NGN:'NG',NIO:'NI',NPR:'NP',NZD:'NZ',OMR:'OM',PAB:'PA',PEN:'PE',PGK:'PG',PHP:'PH',PKR:'PK',PLN:'PL',PYG:'PY',QAR:'QA',RON:'RO',RSD:'RS',RUB:'RU',RWF:'RW',SAR:'SA',SBD:'SB',SCR:'SC',SDG:'SD',SEK:'SE',SGD:'SG',SLL:'SL',SOS:'SO',SRD:'SR',SYP:'SY',SZL:'SZ',THB:'TH',TJS:'TJ',TMT:'TM',TND:'TN',TRY:'TR',TTD:'TT',TWD:'TW',TZS:'TZ',UAH:'UA',UGX:'UG',USD:'US',UYU:'UY',UZS:'UZ',VEF:'VE',VND:'VN',YER:'YE',ZAR:'ZA',ZMK:'ZM' }
const currencyCodes = Object.keys(countryList)

const amount = ref('1'), fromCurrency = ref('USD'), toCurrency = ref('PHP')
const resultText = ref('Click "Get Exchange Rate" to convert')
const quickPairs = [
  { from:'USD', to:'PHP' }, { from:'USD', to:'EUR' }, { from:'USD', to:'JPY' },
  { from:'EUR', to:'GBP' }, { from:'PHP', to:'USD' }, { from:'USD', to:'KRW' },
]

function flagCode(code) { return (countryList[code] || 'US').toLowerCase() }
function swapCurrencies() {
  const tmp = fromCurrency.value; fromCurrency.value = toCurrency.value; toCurrency.value = tmp
  getRate()
}
function setQuick(from, to) { fromCurrency.value = from; toCurrency.value = to; getRate() }
function getRate() {
  resultText.value = 'Fetching rate…'
  const amt = amount.value || 1
  fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency.value}`)
    .then(r => r.json())
    .then(data => {
      const rate = data.conversion_rates[toCurrency.value]
      resultText.value = `${amt} ${fromCurrency.value} = ${(rate * amt).toFixed(4)} ${toCurrency.value}`
    })
    .catch(() => { resultText.value = 'Failed to fetch. Check your connection.' })
}
onMounted(getRate)
</script>
