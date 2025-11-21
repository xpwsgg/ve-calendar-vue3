<template>
  <div class="pop-date-picker">
    <VeCalendar
      v-model="currentSelectedDate"
      mode="mini"
      style="padding: 5px"
      :off-days="offDays"
      :enabled-list="enabledList"
      :disabled-list="disabledList"
      :day-event="dayEvent"
      :day-event-menu="dayEventMenu"
      :day-event-menu-item="dayEventMenuItem"
      :over-hide="overHide"
      :select-mode="selectMode"
      :pick-mode="pickMode"
      :cancel-click="cancelClick"
      :most-choice="mostChoice"
      :lang="lang"
      :right-menu="rightMenu"
      :activate-date="{ year: currentYear, month: currentMonth }"
      :height="height"
      :lunar="lunar"
      :event="event"
      @change="handleDateChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import VeCalendar from '../ve-calendar.vue'

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
const currentSelectedDate = ref<string[]>([])
const outValue = ref<string>('')
const currentYear = ref(props.activateDate.year)
const currentMonth = ref(props.activateDate.month)

// Methods
const handleDateChange = (dates: string[]) => {
  currentSelectedDate.value = dates
  emit('update:modelValue', dates)
  emit('change', dates)
}

// Watchers
watch(
  () => props.modelValue,
  (val) => {
    if (Array.isArray(val)) {
      currentSelectedDate.value = val
      outValue.value = val.join(', ')
    }
  },
  { immediate: true }
)

watch(
  () => props.activateDate,
  (val) => {
    currentYear.value = val.year
    currentMonth.value = val.month
  }
)
</script>

<style scoped>
.pop-date-picker {
  position: absolute;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 2000;
  margin-top: 4px;
}

.flex {
  box-sizing: border-box;
  display: -webkit-box;
  -webkit-box-pack: start;
  -webkit-box-align: start;
  display: -webkit-flex;
  -webkit-justify-content: space-between;
  -webkit-align-items: top;
  display: flex;
  justify-content: space-between;
  align-items: top;
  flex-flow: row wrap;
}
</style>
