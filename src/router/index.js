import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DirectionIndicator from '../views/DirectionIndicator.vue'
import PasswordGenerator from '../views/PasswordGenerator.vue'
import TextAnalyzer from '../views/TextAnalyzer.vue'
import RomanNumerals from '../views/RomanNumerals.vue'
import CurrencyConverter from '../views/CurrencyConverter.vue'
import MeasureConverter from '../views/MeasureConverter.vue'
import LedClock from '../views/LedClock.vue'
import BinaryDecimalHex from '../views/BinaryDecimalHex.vue'
import LogicGate from '../views/LogicGate.vue'
import DummyData from '../views/DummyData.vue'
import QrCode from '../views/QrCode.vue'
import AgeCalculator from '../views/AgeCalculator.vue'
import JsonConverter from '../views/JsonConverter.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/direction-indicator', component: DirectionIndicator },
    { path: '/password-generator', component: PasswordGenerator },
    { path: '/text-analyzer', component: TextAnalyzer },
    { path: '/roman-numerals', component: RomanNumerals },
    { path: '/currency-converter', component: CurrencyConverter },
    { path: '/measure-converter', component: MeasureConverter },
    { path: '/led-clock', component: LedClock },
    { path: '/binary-decimal-hex', component: BinaryDecimalHex },
    { path: '/logic-gate', component: LogicGate },
    { path: '/dummy-data', component: DummyData },
    { path: '/qr-code', component: QrCode },
    { path: '/age-calculator', component: AgeCalculator },
    { path: '/json-converter', component: JsonConverter },
  ]
})
