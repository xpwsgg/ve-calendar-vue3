<template>
  <div class="ve-date-picker">
    <input
      type="text"
      :placeholder="placeholder"
      v-model="outValue"
      @focus="visible = true"
      class="date-picker-input"
    />
    <DatePanel
      v-show="visible"
      v-model="currentSelectedDate"
      :off-days="offDays"
      :enabled-list="enabledList"
      :disabled-list="disabledList"
      :day-event="dayEvent"
      :day-event-menu="dayEventMenu"
      :day-event-menu-item="dayEventMenuItem"
      :over-hide="overHide"
      :activate-date="activateDate"
      :select-mode="selectMode"
      :pick-mode="pickMode"
      :cancel-click="cancelClick"
      :right-menu="rightMenu"
      :most-choice="mostChoice"
      :cross-month="crossMonth"
      :lang="lang"
      :lunar="lunar"
      :event="event"
      :height="height"
      :value-format="valueFormat"
      @update:modelValue="handleDateChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import DatePanel from './date-panel.vue'

// Props
const props = withDefaults(
  defineProps<{
    modelValue?: string[]
    placeholder?: string
    offDays?: string[]
    enabledList?: string[]
    disabledList?: string[]
    dayEvent?: string
    dayEventMenu?: string
    dayEventMenuItem?: string
    overHide?: boolean
    activateDate?: { year: number; month: number }
    selectMode?: 'list' | 'range'
    pickMode?: boolean
    cancelClick?: boolean
    rightMenu?: boolean
    mostChoice?: number
    crossMonth?: boolean
    lang?: 'zh-cn' | 'en'
    lunar?: boolean
    event?: boolean
    height?: string
    valueFormat?: string
  }>(),
  {
    modelValue: () => [],
    placeholder: '请选择日期',
    offDays: () => [],
    enabledList: () => [],
    disabledList: () => [],
    dayEvent: 'day-event',
    dayEventMenu: 'day-event-menu',
    dayEventMenuItem: 'day-event-menu-item',
    overHide: true,
    activateDate: () => {
      const today = new Date()
      return {
        year: today.getFullYear(),
        month: today.getMonth() + 1
      }
    },
    selectMode: 'list',
    pickMode: true,
    cancelClick: true,
    rightMenu: false,
    mostChoice: 0,
    crossMonth: false,
    lang: 'zh-cn',
    lunar: true,
    event: true,
    height: '330px',
    valueFormat: 'yyyy-MM-dd'
  }
)

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  change: [value: string[]]
}>()

// Data
const visible = ref(false)
const outValue = ref<string>('')
const currentSelectedDate = ref<string[]>([])

// Methods
const handleDateChange = (value: string[]) => {
  currentSelectedDate.value = value
}

// 标记是否由内部更新触发，避免循环
let isInternalUpdate = false

// Watchers
watch(
  () => props.modelValue,
  (val) => {
    if (isInternalUpdate) return

    if (Array.isArray(val)) {
      // 接收数组
      currentSelectedDate.value = val
      // 格式化显示值
      if (props.selectMode === 'range' && val.length === 2) {
        outValue.value = val.join(' ~ ')
      } else if (val.length === 1) {
        outValue.value = val[0]
      } else if (val.length > 0) {
        outValue.value = val.join(', ')
      } else {
        outValue.value = ''
      }
    } else if (typeof val === 'string' && val) {
      // 兼容字符串输入 (单个日期)
      outValue.value = val
      currentSelectedDate.value = [val]
    } else {
      outValue.value = ''
      currentSelectedDate.value = []
    }
  },
  { immediate: true }
)

watch(currentSelectedDate, (val) => {
  if (isInternalUpdate) return

  isInternalUpdate = true

  // 格式化显示值 (输入框显示用)
  if (props.selectMode === 'range' && val.length === 2) {
    outValue.value = val.join(' ~ ')
  } else if (val.length === 1) {
    outValue.value = val[0]
  } else if (val.length > 0) {
    outValue.value = val.join(', ')
  } else {
    outValue.value = ''
  }

  // 始终返回数组 (与原版 API 保持一致)
  emit('update:modelValue', val)
  emit('change', val)

  nextTick(() => {
    isInternalUpdate = false
  })
})

// 点击外部关闭面板
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.ve-date-picker')) {
    visible.value = false
  }
}

// 生命周期
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.ve-date-picker {
  position: relative;
  display: inline-block;
}

.date-picker-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  transition: border-color 0.2s;
}

.date-picker-input:focus {
  outline: none;
  border-color: #409eff;
}

.date-picker-input::placeholder {
  color: #c0c4cc;
}
</style>
