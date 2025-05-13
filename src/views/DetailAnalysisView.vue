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
        <input type="datetime-local" v-model="startDate" class="filter-input" />
      </div>

      <div class="filter-group">
        <label class="filter-label">종료일:</label>
        <input type="datetime-local" v-model="endDate" class="filter-input" />
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
      <!-- 시간 표시 메트릭 카드 -->
      <div class="metric-card">
        <div class="metric-title">기간</div>
        <div class="metric-value">{{ dateRange }}분</div>
      </div>
      
      <!-- 각 컬럼별 메트릭 카드 -->
      <div
        v-for="col in columns"
        :key="col"
        class="metric-card"
      >
        <div class="metric-title">{{ col }}</div>
        <div class="metric-value">
          <span class="max-value">{{ statByColumn[col].max }}</span> / 
          <span class="min-value">{{ statByColumn[col].min }}</span>
      </div>
    </div>
  </div>
    
    <div class="chart-container">
      <div class="chart-grid">
        <ChartCard v-for="col in columns" :key="col" :title="col" :data="chartData[col]" :defectData="defectPoints[col]"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ChartCard from '@/components/ChartCard.vue'
import dayjs from 'dayjs'
import axios from 'axios'
import '@/assets/styles/DetailAnalysisDashboard.css'

const startDate = ref('2025-05-10T09:00')
const endDate = ref('2025-05-10T09:02')
const selectedMachine = ref('device1')
const columns = ["footfall", "temp_mode", "AQ", "USS", "CS", "VOC", "RP", "IP", "temperature"]
const chartData = ref({})
const defectPoints = ref({})
const router = useRouter()

// 메트릭계산
const dateRange = computed(() => {
  if (!startDate.value || !endDate.value) return 0
  return dayjs(endDate.value).diff(dayjs(startDate.value), 'minute') // ⏱ 'day' → 'minute'
})

const avgFootfall = computed(() => {
  if (!chartData.value.footfall) return 0
  const sum = chartData.value.footfall.reduce((acc, curr) => acc + parseFloat(curr.y), 0)
  return (sum / chartData.value.footfall.length).toFixed(1)
})

const avgTempMode = computed(() => {
  if (!chartData.value.temp_mode) return 0
  const sum = chartData.value.temp_mode.reduce((acc, curr) => acc + parseFloat(curr.y), 0)
  return (sum / chartData.value.temp_mode.length).toFixed(1)
})

const avgUSS = computed(() => {
  if (!chartData.value.USS) return 0
  const sum = chartData.value.USS.reduce((acc, curr) => acc + parseFloat(curr.y), 0)
  return (sum / chartData.value.USS.length).toFixed(1)
})

const statByColumn = computed(() => {
  const result = {}
  columns.forEach(col => {
    const values = chartData.value[col]?.map(d => parseFloat(d.y)) || []
    if (values.length === 0) {
      result[col] = { max: 0, min: 0 }
    } else {
      result[col] = {
        max: Math.max(...values).toFixed(1),
        min: Math.min(...values).toFixed(1)
      }
    }
  })
  return result
})

const fetchData = async () => {
  const baseURL = 'http://10.250.72.241:8000'
  const params = {
    start_date: `${startDate.value}:00`,
    end_date: `${endDate.value}:00`
  }

  try {
    const res = await axios.get(`${baseURL}/sensor-data`, { params })

    const result = {}
    const defects = {}

    columns.forEach(col => {
      result[col] = []
      defects[col] = []
    })

    res.data.forEach(entry => {
      const time = entry.collection_time

      columns.forEach(col => {
        result[col].push({ x: time, y: entry[col] })
        if (entry.fail) {
          defects[col].push({ x: time, y: entry[col] })
        }
      })
    })

    chartData.value = result
    defectPoints.value = defects

  } catch (err) {
    console.error('데이터 불러오기 실패', err)
  }
}


const backToDashboard = () => {
  router.push('/')
}

onMounted(() => {
  fetchData()
})
</script>
