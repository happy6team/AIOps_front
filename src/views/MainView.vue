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
                <div class="timestamp">{{ item.timestamp }}</div>
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
  const columns = ["footfall", "tempMode", "AQ", "USS", "CS", "VOC", "RP", "IP", "Temperature"]
  const streamData = ref([])
  
  const generateDummy = () => {
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const item = { timestamp }
    for (const col of columns) {
      item[col] = (Math.random() * 100).toFixed(2)
    }
    item.defect = Math.random() > 0.7 ? 1 : 0
    item.probability = item.defect ? (0.7 + Math.random() * 0.3).toFixed(2) : (Math.random() * 0.5).toFixed(2)
    return item
  }
  
  onMounted(() => {
    // 초기 데이터 로드
    for (let i = 0; i < 5; i++) {
      streamData.value.unshift(generateDummy())
    }
    
    // 실시간 데이터 업데이트
    setInterval(() => {
      streamData.value.unshift(generateDummy())
      if (streamData.value.length > 20) streamData.value.pop()
    }, 5000)
  })
  
  const goToDetail = () => {
    router.push('/analysis')
  }
  </script>