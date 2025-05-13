<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3>{{ title }}</h3>
      <div class="chart-actions">
          <button class="action-btn" title="자세히 보기" @click="openModal">
            <span class="action-icon">🔍</span>
          </button>
        <button class="action-btn" title="설정">
          <span class="action-icon">⚙️</span>
        </button>
      </div>
    </div>
    <div class="chart-content">
      <Line :data="chartData" :options="options" />
    </div>
    <div class="chart-footer">
      <div class="stat-item">
        <span class="stat-label">평균</span>
        <span class="stat-value">{{ average }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">최대</span>
        <span class="stat-value">{{ maximum }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">최소</span>
        <span class="stat-value">{{ minimum }}</span>
      </div>
    </div>
    <!-- 모달 추가-->
    <ModalChart
      v-if="showModal"
      :title="title"
      :data="data"
      :defectData="defectData"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Line } from 'vue-chartjs'
import ModalChart from '@/components/ModalChart.vue'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'


ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const props = defineProps({
  title: String,
  data: {
    type: Array,
    default: () => []
  },
  defectData: Array
})

// 통계 계산
const average = computed(() => {
  if (!props.data || props.data.length === 0) return '0.00'
  const sum = props.data.reduce((acc, curr) => acc + parseFloat(curr.y), 0)
  return (sum / props.data.length).toFixed(2)
})

const maximum = computed(() => {
  if (!props.data || props.data.length === 0) return '0.00'
  const values = props.data.map(d => parseFloat(d.y))
  return Math.max(...values).toFixed(2)
})

const minimum = computed(() => {
  if (!props.data || props.data.length === 0) return '0.00'
  const values = props.data.map(d => parseFloat(d.y))
  return Math.min(...values).toFixed(2)
})

// 차트 데이터 준비
const chartData = computed(() => {
  if (!props.data) return { labels: [], datasets: [] }
  
  const formattedLabels = props.data.map(d => {
    // 타임스탬프 포맷 변경 (시간만 표시)
    const time = new Date(d.x).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    })
    return time
  })
  
  let lineColor
  
  // 각 지표별 컬러 지정
  switch(props.title) {
    case 'footfall':
      lineColor = '#10b981' // 초록
      break
    case 'tempMode':
      lineColor = '#f59e0b' // 황색
      break
    case 'AQ':
      lineColor = '#3b82f6' // 파랑
      break
    case 'USS':
      lineColor = '#8b5cf6' // 보라
      break
    case 'CS':
      lineColor = '#ec4899' // 핑크
      break
    case 'VOC':
      lineColor = '#ef4444' // 빨강
      break
    case 'RP':
      lineColor = '#6366f1' // 인디고
      break
    case 'IP':
      lineColor = '#f97316' // 오렌지
      break
    case 'Temperature':
      lineColor = '#e11d48' // 진한 빨강
      break
    default:
      lineColor = '#3b82f6' // 기본 파랑
  }
  
  return {
    labels: formattedLabels,
    datasets: [
      {
        label: props.title,
        data: props.data.map(d => d.y),
        fill: true,
        backgroundColor: `${lineColor}20`, // 투명도 적용
        borderColor: lineColor,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: lineColor,
        pointBorderColor: '#fff',
        pointHoverRadius: 5,
        pointHoverBackgroundColor: lineColor,
        pointHoverBorderColor: '#fff'
      }
    ]
  }
})

// 차트 옵션
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#f8fafc',
      bodyColor: '#f8fafc',
      borderColor: '#334155',
      borderWidth: 1,
      padding: 10,
      boxPadding: 5,
      usePointStyle: true,
      titleFont: {
        size: 12,
        weight: 'bold'
      },
      bodyFont: {
        size: 12
      },
      callbacks: {
        title: function(context) {
          return props.title
        },
        label: function(context) {
          return `값: ${context.raw}`
        }
      }
    }
  },
  scales: {
    x: {
      reverse : true,
      grid: {
        color: '#33415533', // 반투명 그리드 라인
        tickLength: 8
      },
      ticks: {
        color: '#94a3b8',
        font: {
          size: 10
        },
        maxRotation: 0
      },
      title: {
        display: true,
        text: '시간',
        color: '#94a3b8',
        font: {
          size: 12,
          weight: 'normal'
        }
      }
    },
    y: {
      grid: {
        color: '#33415533', // 반투명 그리드 라인
      },
      ticks: {
        color: '#94a3b8',
        font: {
          size: 10
        }
      },
      title: {
        display: true,
        text: props.title,
        color: '#94a3b8',
        font: {
          size: 12,
          weight: 'normal'
        }
      }
    }
  },
  elements: {
    line: {
      borderWidth: 2
    }
  },
  interaction: {
    mode: 'index',
    intersect: false
  },
  animation: {
    duration: 1000
  }
}
// 모달 추가
const showModal = ref(false)

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}
</script>

<style scoped>
.chart-card {
  background-color: #1e293b;
  border-radius: 0.5rem;
  padding: 1rem;
  color: #f8fafc;
  /* 고정 높이 대신 최소 높이 사용 */
  min-height: 350px;
  /* 필요시 자동으로 커지도록 변경 */
  height: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0;
}

.chart-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.action-btn:hover {
  color: #f1f5f9;
  background-color: rgba(255, 255, 255, 0.1);
}

.action-icon {
  font-size: 0.875rem;
}

.chart-content {
  flex: 1;
  position: relative;
  width: 100%;
  overflow: hidden;
}

.chart-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 0.75rem;
  margin-top: 0.5rem;
  border-top: 1px solid #334155;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.75rem;
  color: #94a3b8;
}

.stat-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #f1f5f9;
}

/* 반응형 조정 */
@media (max-width: 600px) {
  .chart-card {
    height: 300px;
  }
  
  .chart-footer {
    flex-direction: row;
    gap: 0.5rem;
  }
  
  .stat-item {
    flex: 1;
  }
}
</style>