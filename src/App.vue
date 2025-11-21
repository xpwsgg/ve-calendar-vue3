<template>
  <div class="app">
    <h1>ve-calendar Vue 3 示例</h1>

    <div class="demo-section">
      <h2>基础用法 - VeCalendar</h2>
      <VeCalendar v-model="selectedDates" @change="handleChange" />
      <p>选中的日期: {{ selectedDates.join(', ') || '无' }}</p>
    </div>

    <div class="demo-section">
      <h2>迷你模式</h2>
      <VeCalendar v-model="miniDates" mode="mini" :lunar="true" />
    </div>

    <div class="demo-section">
      <h2>范围选择</h2>
      <VeCalendar v-model="rangeDates" selectMode="range" :mostChoice="2" />
      <p>选中的范围: {{ rangeDates.join(' ~ ') || '无' }}</p>
    </div>

    <div class="demo-section">
      <h2>自定义休息日</h2>
      <VeCalendar v-model="customDates" :offDays="customOffDays" />
    </div>

    <div class="demo-section">
      <h2>英文模式</h2>
      <VeCalendar v-model="enDates" lang="en" :lunar="false" />
    </div>

    <div class="demo-section">
      <h2>年视图 - VeYear</h2>
      <VeYear v-model="yearDates" :year="currentYear" height="250px" />
      <p>选中的日期: {{ yearDates.join(', ') || '无' }}</p>
    </div>

    <div class="demo-section">
      <h2>年视图 - 范围选择</h2>
      <VeYear v-model="yearRangeDates" :year="currentYear" selectMode="range" height="250px" />
      <p>选中的范围: {{ yearRangeDates.join(' ~ ') || '无' }}</p>
    </div>

    <div class="demo-section">
      <h2>日期选择器 - VeDatePicker</h2>
      <VeDatePicker v-model="pickerDate" placeholder="请选择日期" />
      <p>选中的日期: {{ pickerDate.length > 0 ? pickerDate.join(', ') : '无' }}</p>
    </div>

    <div class="demo-section">
      <h2>日期选择器 - 范围选择</h2>
      <VeDatePicker
        v-model="pickerRangeDate"
        selectMode="range"
        placeholder="请选择日期范围"
      />
      <p>选中的范围: {{ pickerRangeDate.length > 0 ? pickerRangeDate.join(' ~ ') : '无' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VeCalendar from './lib/ve-calendar.vue'
import VeYear from './lib/ve-year.vue'
import VeDatePicker from './lib/ve-date-picker/index.vue'

// 基础用法
const selectedDates = ref<string[]>([])

const handleChange = (dates: string[]) => {
  console.log('日期变化:', dates)
}

// 迷你模式
const miniDates = ref<string[]>([])

// 范围选择
const rangeDates = ref<string[]>([])

// 自定义休息日
const customDates = ref<string[]>([])
const today = new Date()
const year = today.getFullYear()
const month = String(today.getMonth() + 1).padStart(2, '0')
const customOffDays = ref([
  `${year}-${month}-01`,
  `${year}-${month}-15`,
  `${year}-${month}-20`
])

// 英文模式
const enDates = ref<string[]>([])

// 年视图
const currentYear = ref(new Date().getFullYear())
const yearDates = ref<string[]>([])
const yearRangeDates = ref<string[]>([])

// 日期选择器
const pickerDate = ref<string[]>([])
const pickerRangeDate = ref<string[]>([])
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f5f7fa;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #303133;
  margin-bottom: 40px;
}

h2 {
  color: #606266;
  font-size: 18px;
  margin-bottom: 20px;
}

.demo-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.demo-section p {
  margin-top: 15px;
  color: #909399;
  font-size: 14px;
}
</style>
