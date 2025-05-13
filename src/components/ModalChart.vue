<template>
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ title }} (확대 보기)</h2>
          <button class="close-btn" @click="close">✖</button>
        </div>
        <div class="modal-body">
          <Line :data="chartData" :options="options" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { Line } from 'vue-chartjs'
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
    data: Array
  })
  
  const emit = defineEmits(['close'])
  const close = () => emit('close')
  
  const chartData = computed(() => {
    const lineColor = '#3b82f6'
    return {
      labels: props.data.map(d => new Date(d.x).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })),
      datasets: [
        {
          label: props.title,
          data: props.data.map(d => d.y),
          borderColor: lineColor,
          backgroundColor: `${lineColor}20`,
          fill: true,
          tension: 0.3,
          pointRadius: d => d.raw.defect ? 6 : 3,
          pointBackgroundColor: d => d.raw.defect ? '#ef4444' : lineColor
        }
      ]
    }
  })
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { title: { display: true, text: '시간' } },
      y: { title: { display: true, text: props.title } }
    }
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  .modal-content {
    background: #1e293b;
    padding: 1rem;
    border-radius: 0.5rem;
    width: 90%;
    max-width: 800px;
    height: 500px;
    display: flex;
    flex-direction: column;
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #f8fafc;
    margin-bottom: 0.5rem;
  }
  .close-btn {
    background: none;
    border: none;
    color: #f8fafc;
    font-size: 1.25rem;
    cursor: pointer;
  }
  .modal-body {
    flex: 1;
  }
  </style>