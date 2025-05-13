import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import DetailAnalysisView from '@/views/DetailAnalysisView.vue'


const routes = [
  {
    path: '/',
    name: 'Main',
    component: MainView
  },
  {
    path: '/analysis',
    name: 'DetailAnalysis',
    component: DetailAnalysisView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
