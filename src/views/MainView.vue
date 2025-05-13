<template>
    <div class="main-page">
      <header class="header">
        <div class="header-left">
          <h1>📊 제조 설비 모니터링 대시보드</h1>
        </div>
        <div class="header-right">
          <button class="btn btn-primary" @click="goToDetail">상세 페이지로 이동</button>
        </div>
      </header>
  
      <div class="content">
        <aside class="sidebar">
          <div class="sidebar-top">
            <div class="brand">
              <div class="logo">ML</div>
              <div class="brand-name">Manufacturing Lab</div>
            </div>
            <nav class="nav-menu">
              <button class="nav-item active">
                <span class="nav-icon">📈</span>
                <span class="nav-text">대시보드</span>
              </button>
              <button class="nav-item" @click="goToDetail">
                <span class="nav-icon">🔍</span>
                <span class="nav-text">상세 분석</span>
              </button>
              <button class="nav-item">
                <span class="nav-icon">⚙️</span>
                <span class="nav-text">설정</span>
              </button>
            </nav>
          </div>
          <div class="sidebar-bottom">
            <button class="btn-logout">
              <span class="logout-icon">🚪</span>
              <span class="logout-text">로그아웃</span>
            </button>
          </div>
        </aside>
  
        <main class="data-stream">
          <div class="page-title">실시간 데이터 스트림</div>
          <div class="stream-container">
            <div v-for="item in streamData" :key="item.timestamp"
                 :class="['data-row', item.defect ? 'defect' : 'normal']">
              <div class="row-header">
                <div class="timestamp">{{ formatTime(item.timestamp) }}</div>
                <div class="status" :class="item.defect ? 'status-defect' : 'status-normal'">
                  {{ item.defect ? '결함 감지' : '정상' }}
                </div>
              </div>
              <div class="columns">
                <div v-for="col in columns" :key="col" class="data-item">
                  <div class="data-label">{{ col }}</div>
                  <div class="data-value">{{ item[col] }}</div>
                </div>
              </div>
              <div class="probability-container">
                <div class="probability-label">결함 확률</div>
                <div class="probability-bar-container">
                  <div class="probability-bar" 
                       :style="{ width: (parseFloat(item.probability) * 100) + '%', 
                                backgroundColor: item.defect ? '#ef4444' : '#10b981' }">
                  </div>
                </div>
                <div class="probability-value">{{ (parseFloat(item.probability) * 100).toFixed(0) }}%</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import '@/assets/styles/MainDashboard.css'
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import dayjs from 'dayjs'

  const router = useRouter()
  const columns = ["footfall", "temp_mode", "AQ", "USS", "CS", "VOC", "RP", "IP", "temperature"]
  const streamData = ref([])
  
  const fetchLatestSensorData = async () => {
  try {
    const res = await fetch('http://10.250.72.241:8000/sensor-data/latest')
    if (!res.ok) throw new Error('네트워크 오류 발생')
    const data = await res.json()

    const formatted = {
      timestamp: data.collection_time,
      defect: data.fail,
      fail_probability: data.fail_probability ?? 0
    }

    columns.forEach(col => {
      formatted[col] = data[col]
    })

    streamData.value.unshift(formatted)
    if (streamData.value.length > 20) streamData.value.pop()
  } catch (err) {
    console.error('실시간 데이터 요청 실패:', err)
  }
}

onMounted(() => {
  fetchLatestSensorData()
  setInterval(fetchLatestSensorData, 5000)
})

const goToDetail = () => {
  router.push('/analysis')
}

const formatTime = (rawTime) => {
  return dayjs(rawTime).format('YYYY.MM.DD HH:mm:ss')  // 또는 'A hh:mm:ss' 도 가능
}
  </script>