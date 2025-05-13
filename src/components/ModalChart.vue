<template>
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ title }} (확대 보기)</h2>
          <button class="close-btn" @click="close">✖</button>
        </div>
        <div class="modal-body">
          <component :is="chartType === 'bar' ? Bar : Line"
                     :data="chartData"
                     :options="options"
                     :key="chartType" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { Line, Bar } from 'vue-chartjs'
  import '@/assets/styles/ModalChartDashboard.css'
  
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
    data: Array,
    defectData: Array,
    chartType: {
        type: String,
        default: 'line'
    }
    })

    const emit = defineEmits(['close'])
    const close = () => emit('close')

    // 차트 데이터 구성
    const chartData = computed(() => {
    const lineColor = '#3b82f6'
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
            type: props.chartType,
            label: props.title,
            data: props.data.map(d => d.y),
            borderColor: lineColor,
            backgroundColor: props.chartType === 'bar' ? lineColor : `${lineColor}20`,
            borderColor: lineColor,
            borderWidth: props.chartType === 'bar' ? 1 : 2,

            fill: true
        }
        ]
    }
    })

    const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        x: {
            reverse: true,
            title: { display: true, text: '시간' },
            ticks: {
                color: '#94a3b8',
                font: { size: 10 },
                maxRotation: 0
            },
            grid: {
                color: '#33415533',
                tickLength: 8
            }
        },
        y: {
            title: { display: true, text: props.title }
        }
    }
    }
  </script>
