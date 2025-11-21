<template>
  <div class="ve-year">
    <div v-for="m in 12" :key="m" class="col-3">
      <VeCalendar
        :ref="(el) => (calendarRefs[m - 1] = el)"
        v-model="selectedDate"
        mode="mini"
        style="padding: 5px"
        :activate-date="{ year, month: m }"
        :height="height"
        :off-days="offDays"
        :enabled-list="enabledList"
        :disabled-list="disabledList"
        :day-event="dayEvent"
        :day-event-menu="dayEventMenu"
        :day-event-menu-item="dayEventMenuItem"
        :pick-mode="pickMode"
        :select-mode="selectMode"
        :cancel-click="cancelClick"
        :right-menu="rightMenu"
        :most-choice="mostChoice"
        :cross-month="crossMonth"
        :lang="lang"
        :event="event"
        :over-hide="true"
        :lunar="lunar"
        @change="changeSelected"
        @mouse-up="dayMouseUp"
      >
        <template #header="{ month }">
          {{ month }}月
        </template>
      </VeCalendar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import VeCalendar from './ve-calendar.vue'
import type { CalendarDay } from '@/types'

// Props
const props = withDefaults(
  defineProps<{
    modelValue?: string[]
    year?: number
    mode?: string
    offDays?: string[]
    enabledList?: string[]
    disabledList?: string[]
    dayEvent?: string
    dayEventMenu?: string
    dayEventMenuItem?: string
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
  }>(),
  {
    modelValue: () => [],
    year: () => new Date().getFullYear(),
    mode: 'mini',
    offDays: () => [],
    enabledList: () => [],
    disabledList: () => [],
    dayEvent: 'day-event',
    dayEventMenu: 'day-event-menu',
    dayEventMenuItem: 'day-event-menu-item',
    selectMode: 'list',
    pickMode: true,
    cancelClick: true,
    rightMenu: true,
    mostChoice: 0,
    crossMonth: false,
    lang: 'zh-cn',
    lunar: false,
    event: false,
    height: '300px'
  }
)

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  change: [value: string[]]
}>()

// Data
const selectedDate = ref<string[]>([])
const selectedRange = ref<string[]>([])
const calendarRefs = ref<any[]>([])

// Methods
const changeSelected = (date: string[]) => {
  // 合并选择项
  for (const item of date) {
    if (selectedDate.value.indexOf(item) < 0) {
      selectedDate.value.push(item)
    }
  }
}

const unAllSelected = () => {
  calendarRefs.value.forEach((cal) => {
    if (cal && cal.unAllSelected) {
      cal.unAllSelected()
    }
  })
}

const dayMouseUp = (event: MouseEvent | undefined, row: CalendarDay, index: number) => {
  if (props.selectMode === 'range') {
    if (selectedRange.value.length < 2) {
      selectedRange.value.push(row.sDate)
    } else {
      // 重选
      selectedRange.value = [row.sDate]
      unAllSelected()
    }
    if (selectedRange.value.length === 2) {
      const range = [...selectedRange.value].sort()
      selectedDate.value = JSON.parse(JSON.stringify([range[0], range[range.length - 1]]))
    }
  }
}

// Watchers - 只监听 selectedDate 的变化，不监听 props.modelValue
watch(
  selectedDate,
  (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
  { deep: true }
)

// Expose methods
defineExpose({
  unAllSelected
})
</script>

<style scoped>
.ve-year {
  display: flex;
  flex-wrap: wrap;
}

.col-3 {
  width: calc((100% - 25px) / 3);
  display: inline-block;
}
</style>
