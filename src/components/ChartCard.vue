<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3>{{ title }}</h3>
      <div class="chart-actions">
        <button class="action-btn" title="자세히 보기" @click="openModal">🔍</button>
        <button class="action-btn" title="CSV 다운로드" @click="downloadCSV">📥</button>
        <button class="action-btn" title="차트 유형 전환" @click="toggleChartType">🔁</button>
      </div>
    </div>

    <div class="chart-content">
      <Line :data="getChartData()" :options="options" :key="chartType" />
    </div>

    <div class="chart-footer">
      <div class="stat-item"><span class="stat-label">평균</span><span class="stat-value">{{ average }}</span></div>
      <div class="stat-item"><span class="stat-label">최대</span><span class="stat-value">{{ maximum }}</span></div>
      <div class="stat-item"><span class="stat-label">최소</span><span class="stat-value">{{ minimum }}</span></div>
    </div>

    <ModalChart
      v-if="showModal"
      :title="title"
      :data="data"
      :defectData="defectData"
      :chartType="chartType"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Line } from 'vue-chartjs'
import ModalChart from '@/components/ModalChart.vue'
import '@/assets/styles/ChartCardDashboard.css'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement)

const props = defineProps({
  title: String,
  data: { type: Array, default: () => [] },
  defectData: Array
})


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

const chartType = ref('line') // 'line' 또는 'bar'

const getChartData = () => {
  if (!props.data) return { labels: [], datasets: [] }

  const formattedLabels = props.data.map(d =>
    new Date(d.x).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  )

  let lineColor
  switch (props.title) {
    case 'footfall': lineColor = '#10b981'; break
    case 'tempMode': lineColor = '#f59e0b'; break
    case 'AQ': lineColor = '#3b82f6'; break
    case 'USS': lineColor = '#8b5cf6'; break
    case 'CS': lineColor = '#ec4899'; break
    case 'VOC': lineColor = '#ef4444'; break
    case 'RP': lineColor = '#6366f1'; break
    case 'IP': lineColor = '#f97316'; break
    case 'Temperature': lineColor = '#e11d48'; break
    default: lineColor = '#3b82f6'
  }

  return {
    labels: props.data.map(d =>
        new Date(d.x).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
        ),
    datasets: [
      {
        type: chartType.value,
        label: props.title,
        data: props.data.map(d => d.y),
        fill: true,
        backgroundColor: `${lineColor}20`,
        borderColor: lineColor,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: lineColor,
        pointBorderColor: '#fff',
        pointHoverRadius: 5,
        pointHoverBackgroundColor: lineColor,
        pointHoverBorderColor: '#fff',
        backgroundColor: chartType.value === 'bar' ? lineColor : `${lineColor}20`,
        borderColor: lineColor,
        borderWidth: chartType.value === 'bar' ? 1 : 2,

      }
    ]
  }
}
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#f8fafc',
      bodyColor: '#f8fafc',
      borderColor: '#334155',
      borderWidth: 1,
      padding: 10,
      boxPadding: 5,
      usePointStyle: true,
      titleFont: { size: 12, weight: 'bold' },
      bodyFont: { size: 12 },
      callbacks: {
        title: () => props.title,
        label: context => `값: ${context.raw}`
      }
    }
  },
  scales: {
    x: {
      reverse: true, // 오른쪽이 최신
      grid: { color: '#33415533', tickLength: 8 },
      ticks: { color: '#94a3b8', font: { size: 10 }, maxRotation: 0 },
      title: { display: true, text: '시간', color: '#94a3b8', font: { size: 12 } }
    },
    y: {
      grid: { color: '#33415533' },
      ticks: { color: '#94a3b8', font: { size: 10 } },
      title: { display: true, text: props.title, color: '#94a3b8', font: { size: 12 } }
    }
  },
  elements: { line: { borderWidth: 2 } },
  interaction: { mode: 'index', intersect: false },
  animation: { duration: 1000 }
}

const showModal = ref(false)
const openModal = () => { showModal.value = true }
const closeModal = () => { showModal.value = false }

const toggleChartType = () => {
  chartType.value = chartType.value === 'line' ? 'bar' : 'line'
}

const downloadCSV = () => {
  const headers = ['시간', props.title]
  const rows = props.data.map(d => [d.x, d.y])
  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', `${props.title}_data.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

</script>