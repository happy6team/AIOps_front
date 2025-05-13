<template>
  <div class="analysis-page">
    <header class="analysis-header">
      <div class="header-title">
        <h1>📊 상세 데이터 분석</h1>
      </div>
      <button class="btn btn-secondary" @click="backToDashboard">대시보드로 돌아가기</button>
    </header>
    
    <div class="filter-section">
      <div class="filter-group">
        <label class="filter-label">시작일:</label>
        <input type="date" v-model="startDate" class="filter-input" />
      </div>
      <div class="filter-group">
        <label class="filter-label">종료일:</label>
        <input type="date" v-model="endDate" class="filter-input" />
      </div>
      <div class="filter-group">
        <label class="filter-label">장비 선택:</label>
        <select v-model="selectedMachine" class="filter-input">
          <option value="device1">기계 A</option>
          <option value="device2">기계 B</option>
          <option value="device3">기계 C</option>
        </select>
      </div>
      <button @click="fetchData" class="btn btn-primary">조회</button>
    </div>
    
    <div class="metrics-summary">
      <div class="metric-card">
        <div class="metric-title">데이터 포인트</div>
        <div class="metric-value">{{ totalDataPoints }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-title">기간</div>
        <div class="metric-value">{{ dateRange }} 일</div>
      </div>
      <div class="metric-card">
        <div class="metric-title">평균 온도</div>
        <div class="metric-value">{{ avgTemperature }}°C</div>
      </div>
      <div class="metric-card">
        <div class="metric-title">최대 AQ</div>
        <div class="metric-value">{{ maxAQ }}</div>
      </div>
    </div>
    
    <div class="chart-container">
      <div class="chart-grid">
        <ChartCard v-for="col in columns" :key="col" :title="col" :data="chartData[col]" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ChartCard from '@/components/ChartCard.vue'
import dayjs from 'dayjs'
import '@/assets/styles/DetailAnalysisDashboard.css'

const dummyData = [
  {
    timestamp: '2025-05-13 10:00:00',
    footfall: 65.2,
    tempMode: 73.1,
    AQ: 24.6,
    USS: 41.3,
    CS: 86.7,
    VOC: 12.4,
    RP: 63.5,
    IP: 33.9,
    Temperature: 78.2,
  },
  {
    timestamp: '2025-05-13 11:00:00',
    footfall: 58.9,
    tempMode: 70.5,
    AQ: 29.1,
    USS: 45.1,
    CS: 80.4,
    VOC: 18.7,
    RP: 61.2,
    IP: 30.5,
    Temperature: 75.9,
  },
  {
    timestamp: '2025-05-13 12:00:00',
    footfall: 72.4,
    tempMode: 69.8,
    AQ: 31.0,
    USS: 48.2,
    CS: 78.9,
    VOC: 15.3,
    RP: 65.0,
    IP: 28.3,
    Temperature: 76.5,
  },
  {
    timestamp: '2025-05-13 13:00:00',
    footfall: 60.7,
    tempMode: 68.3,
    AQ: 26.4,
    USS: 42.0,
    CS: 83.2,
    VOC: 20.1,
    RP: 62.3,
    IP: 32.1,
    Temperature: 74.8,
  },
  {
    timestamp: '2025-05-13 14:00:00',
    footfall: 67.8,
    tempMode: 71.6,
    AQ: 28.8,
    USS: 47.6,
    CS: 81.5,
    VOC: 17.9,
    RP: 64.1,
    IP: 31.7,
    Temperature: 77.0,
  },
  {
    timestamp: '2025-05-13 15:00:00',
    footfall: 70.5,
    tempMode: 72.4,
    AQ: 25.3,
    USS: 43.8,
    CS: 85.1,
    VOC: 14.2,
    RP: 66.7,
    IP: 29.8,
    Temperature: 78.9,
  },
  {
    timestamp: '2025-05-13 16:00:00',
    footfall: 64.1,
    tempMode: 70.9,
    AQ: 27.5,
    USS: 46.3,
    CS: 82.8,
    VOC: 16.5,
    RP: 63.8,
    IP: 33.2,
    Temperature: 76.3,
  }
]

const startDate = ref(dayjs().subtract(7, 'day').format('YYYY-MM-DD'))
const endDate = ref(dayjs().format('YYYY-MM-DD'))
const selectedMachine = ref('device1')
const columns = ["footfall", "tempMode", "AQ", "USS", "CS", "VOC", "RP", "IP", "Temperature"]
const chartData = ref({})

// 메트릭 계산
const totalDataPoints = computed(() => {
  if (!chartData.value.Temperature) return 0
  return chartData.value.Temperature.length
})

const dateRange = computed(() => {
  if (!startDate.value || !endDate.value) return 0
  return dayjs(endDate.value).diff(dayjs(startDate.value), 'day')
})

const avgTemperature = computed(() => {
  if (!chartData.value.Temperature) return 0
  const sum = chartData.value.Temperature.reduce((acc, curr) => acc + parseFloat(curr.y), 0)
  return (sum / chartData.value.Temperature.length).toFixed(1)
})

const maxAQ = computed(() => {
  if (!chartData.value.AQ) return 0
  const values = chartData.value.AQ.map(d => parseFloat(d.y))
  return Math.max(...values).toFixed(1)
})

const fetchData = async () => {
  // 실제 구현에서는 API 요청이 여기에 들어갑니다
  console.log(`Fetching data for ${selectedMachine.value} from ${startDate.value} to ${endDate.value}`)
  
  const result = {}
  columns.forEach(col => {
    result[col] = dummyData.map(entry => ({
      x: entry.timestamp,
      y: entry[col]
    }))
  })
  
  chartData.value = result
}

const backToDashboard = () => {
  // 실제 구현에서는 라우터 내비게이션이 여기에 들어갑니다
  console.log("대시보드로 돌아가기")
}

onMounted(() => {
  fetchData()
})
</script>