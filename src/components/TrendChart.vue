<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  data: {
    sent: number
    failed: number
    total: number
  }
  timeRange: 'today' | 'week' | 'month'
}>()

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  
  // 使用 try-catch 包裹初始化逻辑
  try {
    chart = echarts.init(chartRef.value, undefined, {
      renderer: 'canvas'
    })
    updateChart()
  } catch (error) {
    console.error('Failed to initialize chart:', error)
  }
}

const updateChart = () => {
  if (!chart) return

  try {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['发送成功', '发送失败'],
        top: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: generateTimeLabels(),
        axisLabel: {
          interval: 0,
          rotate: props.timeRange === 'month' ? 30 : 0
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: '发送成功',
          type: 'line',
          smooth: true,
          data: generateMockData(props.data.sent),
          itemStyle: {
            color: '#67c23a'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(103,194,58,0.3)' },
              { offset: 1, color: 'rgba(103,194,58,0.1)' }
            ])
          }
        },
        {
          name: '发送失败',
          type: 'line',
          smooth: true,
          data: generateMockData(props.data.failed),
          itemStyle: {
            color: '#f56c6c'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(245,108,108,0.3)' },
              { offset: 1, color: 'rgba(245,108,108,0.1)' }
            ])
          }
        }
      ]
    }

    chart.setOption(option)
  } catch (error) {
    console.error('Failed to update chart:', error)
  }
}

const generateTimeLabels = () => {
  const count = props.timeRange === 'today' ? 24 
    : props.timeRange === 'week' ? 7 
    : 30

  if (props.timeRange === 'today') {
    return Array.from({ length: count }, (_, i) => `${i}:00`)
  } else if (props.timeRange === 'week') {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days
  } else {
    return Array.from({ length: count }, (_, i) => `${i + 1}日`)
  }
}

const generateMockData = (total: number) => {
  const count = props.timeRange === 'today' ? 24 
    : props.timeRange === 'week' ? 7 
    : 30
  
  return Array.from({ length: count }, () => 
    Math.floor(total / count * (0.8 + Math.random() * 0.4))
  )
}

// 优化图表重绘逻辑
const handleResize = () => {
  if (chart) {
    try {
      chart.resize()
    } catch (error) {
      console.error('Failed to resize chart:', error)
    }
  }
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

// 在组件卸载时清理资源
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chart) {
    chart.dispose()
    chart = null
  }
})

// 监听数据变化
watch(() => props.timeRange, updateChart)
watch(() => props.data, updateChart, { deep: true })
</script>

<template>
  <div 
    ref="chartRef" 
    class="trend-chart"
  />
</template>

<style lang="scss" scoped>
.trend-chart {
  width: 100%;
  height: 400px;
  // 添加最小宽度以避免图表过小时显示异常
  min-width: 300px;
}
</style>