<template>
  <ToolLayout title="Currency Converter" subtitle="Live exchange rates powered by ExchangeRate-API">
    <div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-5">

      <!-- Quick rates -->
      <div class="bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
        <h2 class="text-lg font-semibold text-gray-700 flex items-center gap-2"><i class="bx bx-trending-up text-yellow-500"></i> Quick Rates</h2>
        <p class="text-xs text-gray-400 font-light">Click to load into converter</p>
        <div class="flex flex-col gap-2">
          <button v-for="q in quickPairs" :key="q.from+q.to" @click="setQuick(q.from, q.to)"
            class="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-blue-50 transition text-sm">
            <span class="text-gray-600">{{ q.from }} → {{ q.to }}</span><i class="bx bx-right-arrow-alt text-blue-400"></i>
          </button>
        </div>
      </div>

      <!-- Converter -->
      <div class="lg:col-span-2 bg-white rounded-2xl shadow p-6 flex flex-col gap-5">
        <h2 class="text-lg font-semibold text-gray-700 flex items-center gap-2"><i class="bx bx-dollar-circle text-yellow-500"></i> Converter</h2>
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-500">Amount</label>
          <input v-model="amount" type="text" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div class="grid grid-cols-5 gap-3 items-end">
          <div class="col-span-2 flex flex-col gap-1">
            <label class="text-sm text-gray-500">From</label>
            <div class="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 h-11 gap-2">
              <img :src="`https://flagcdn.com/48x36/${flagCode(fromCurrency)}.png`" class="w-5 h-4 object-cover rounded-sm" />
              <select v-model="fromCurrency" class="bg-transparent outline-none text-sm w-full">
                <option v-for="code in currencyCodes" :key="code" :value="code">{{ code }}</option>
              </select>
            </div>
          </div>
          <div class="flex justify-center">
            <button @click="swapCurrencies" class="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition text-xl">
              <i class="bx bx-transfer"></i>
            </button>
          </div>
          <div class="col-span-2 flex flex-col gap-1">
            <label class="text-sm text-gray-500">To</label>
            <div class="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 h-11 gap-2">
              <img :src="`https://flagcdn.com/48x36/${flagCode(toCurrency)}.png`" class="w-5 h-4 object-cover rounded-sm" />
              <select v-model="toCurrency" class="bg-transparent outline-none text-sm w-full">
                <option v-for="code in currencyCodes" :key="code" :value="code">{{ code }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="bg-blue-50 rounded-xl p-4 text-center text-blue-600 font-semibold text-lg">{{ resultText }}</div>
        <button @click="getRate" class="w-full bg-blue-500 text-white font-semibold py-3 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
          <i class="bx bx-refresh"></i> Get Exchange Rate
        </button>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ToolLayout from '../components/layouts/ToolLayout.vue'

const API_KEY = 'e759f92560e41c99ee6213a2'
const countryList = { AED:'AE',AFN:'AF',XCD:'AG',ALL:'AL',AMD:'AM',ANG:'AN',AOA:'AO',ARS:'AR',AUD:'AU',AZN:'AZ',BAM:'BA',BBD:'BB',BDT:'BD',XOF:'BE',BGN:'BG',BHD:'BH',BIF:'BI',BMD:'BM',BND:'BN',BOB:'BO',BRL:'BR',BSD:'BS',NOK:'BV',BWP:'BW',BYR:'BY',BZD:'BZ',CAD:'CA',CDF:'CD',XAF:'CF',CHF:'CH',CLP:'CL',CNY:'CN',COP:'CO',CRC:'CR',CUP:'CU',CVE:'CV',CZK:'CZ',DJF:'DJ',DKK:'DK',DOP:'DO',DZD:'DZ',EGP:'EG',ETB:'ET',EUR:'FR',FJD:'FJ',FKP:'FK',GBP:'GB',GEL:'GE',GHS:'GH',GIP:'GI',GMD:'GM',GNF:'GN',GTQ:'GT',GYD:'GY',HKD:'HK',HNL:'HN',HRK:'HR',HTG:'HT',HUF:'HU',IDR:'ID',ILS:'IL',INR:'IN',IQD:'IQ',IRR:'IR',ISK:'IS',JMD:'JM',JOD:'JO',JPY:'JP',KES:'KE',KGS:'KG',KHR:'KH',KMF:'KM',KPW:'KP',KRW:'KR',KWD:'KW',KYD:'KY',KZT:'KZ',LAK:'LA',LBP:'LB',LKR:'LK',LRD:'LR',LYD:'LY',MAD:'MA',MDL:'MD',MGA:'MG',MKD:'MK',MMK:'MM',MNT:'MN',MUR:'MU',MVR:'MV',MWK:'MW',MXN:'MX',MYR:'MY',MZN:'MZ',NAD:'NA',NGN:'NG',NIO:'NI',NPR:'NP',NZD:'NZ',OMR:'OM',PAB:'PA',PEN:'PE',PGK:'PG',PHP:'PH',PKR:'PK',PLN:'PL',PYG:'PY',QAR:'QA',RON:'RO',RSD:'RS',RUB:'RU',RWF:'RW',SAR:'SA',SBD:'SB',SCR:'SC',SDG:'SD',SEK:'SE',SGD:'SG',SLL:'SL',SOS:'SO',SRD:'SR',SYP:'SY',SZL:'SZ',THB:'TH',TJS:'TJ',TMT:'TM',TND:'TN',TRY:'TR',TTD:'TT',TWD:'TW',TZS:'TZ',UAH:'UA',UGX:'UG',USD:'US',UYU:'UY',UZS:'UZ',VEF:'VE',VND:'VN',YER:'YE',ZAR:'ZA',ZMK:'ZM' }
const currencyCodes = Object.keys(countryList)

const amount = ref('1'), fromCurrency = ref('USD'), toCurrency = ref('PHP')
const resultText = ref('Getting exchange rate...')
const quickPairs = [
  { from:'USD', to:'PHP' }, { from:'USD', to:'EUR' }, { from:'USD', to:'JPY' },
  { from:'EUR', to:'GBP' }, { from:'PHP', to:'USD' }, { from:'USD', to:'KRW' }
]

function flagCode(code) { return (countryList[code] || 'US').toLowerCase() }

function swapCurrencies() {
  const tmp = fromCurrency.value; fromCurrency.value = toCurrency.value; toCurrency.value = tmp
  getRate()
}

function setQuick(from, to) { fromCurrency.value = from; toCurrency.value = to; getRate() }

function getRate() {
  resultText.value = 'Getting exchange rate...'
  const amt = amount.value || 1
  fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency.value}`)
    .then(r => r.json())
    .then(data => {
      const rate = data.conversion_rates[toCurrency.value]
      resultText.value = `${amt} ${fromCurrency.value} = ${(rate * amt).toFixed(2)} ${toCurrency.value}`
    })
    .catch(() => { resultText.value = 'Something went wrong. Check your connection.' })
}

onMounted(getRate)
</script>
