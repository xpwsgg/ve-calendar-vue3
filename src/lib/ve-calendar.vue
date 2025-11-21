<template>
  <div v-menu ref="containerRef">
    <div class="ve-calendar" :class="{ mini: currentMode === 'mini' }" :style="`height:${height}`">
      <!-- 头部 -->
      <div ref="headerRef" class="header">
        <slot name="header" :year="currentYear" :month="currentMonth + 1">
          <div class="ve-button last" @click="lastMonth">
            <i class="ve-icon icon-last"></i>
          </div>
          <div class="ve-button month">
            <div style="width: 100%">
              <div class="dropdown" :class="{ mini: currentMode === 'mini' }">
                <span>{{ language(`${currentMonth + 1}月`) }}</span>
                <div class="dropdown-content" :class="{ mini: currentMode === 'mini' }">
                  <div
                    v-for="m in 12"
                    :key="`dropdown_m${m}`"
                    class="dropdown-month"
                    :class="{ mini: currentMode === 'mini', activated: m === currentMonth + 1 }"
                    @click="gotoMonth(m)"
                  >
                    {{ language(`${m}月`) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="ve-button next" @click="nextMonth">
            <i class="ve-icon icon-next"></i>
          </div>
          <div class="ve-button year">
            <input
              v-model.number="currentYear"
              type="number"
              class="ve-year"
              :class="{ mini: currentMode === 'mini' }"
              :min="1900"
              @input="changeYear"
            />
            <span v-show="showErr" style="font-size: 12px; position: absolute; margin-left: 20px; color: rgba(1, 1, 1, 0.3)">
              {{ language('不支持') }}
            </span>
          </div>
          <div class="ve-button today" @click="goToday">{{ language('今天') }}</div>
        </slot>
      </div>

      <!-- 日历主体 -->
      <div ref="bodyRef" class="body">
        <!-- 星期标题 -->
        <div ref="titleRef" class="week-title">
          <div v-for="week in weekTitleData" :key="week" class="title-grid">{{ language(week) }}</div>
        </div>

        <!-- 日期格子 -->
        <div ref="daysRef" class="days">
          <div v-for="line in 6" :key="`line_${line}`" class="days-line">
            <div
              v-for="(row, index) in monthData.slice((line - 1) * 7, line * 7)"
              :key="`grid_${index}`"
              class="day-grid"
              :class="{
                gray: row.sMonth !== currentMonth + 1 && crossMonth,
                hide: row.sMonth !== currentMonth + 1 && overHide,
                mini: currentMode === 'mini',
                disabled:
                  (row.sMonth !== currentMonth + 1 && !crossMonth) ||
                  (enabledList.length > 0 && !enabledList.includes(row.sDate)) ||
                  (disabledList.length > 0 && disabledList.includes(row.sDate)) ||
                  hasRange(row.sDate),
                selected: row.selected === true,
                preview: row.preview === true,
                today: row.sDay === today.getDate() && row.sMonth === today.getMonth() + 1 && row.sYear === today.getFullYear()
              }"
              @mousedown="(e) => dayMouseDown(e, row, line * 7 - 7 + index)"
              @mousemove="(e) => dayMouseMove(e, row, line * 7 - 7 + index)"
              @mouseup="(e) => dayMouseUp(e, row, line * 7 - 7 + index)"
            >
              <div class="day-title" :class="{ mini: currentMode === 'mini' }">
                <div class="day-number" :class="{ mini: currentMode === 'mini' }">
                  <slot name="day-number" :day="row">
                    <div :style="getHoliday(row)">{{ row.sDay }}</div>
                  </slot>
                </div>
                <div
                  v-if="currentMode === 'normal' && lunar"
                  class="day-lunar"
                  :style="`color:${row.color}`"
                  :title="getLunar(row)"
                >
                  <slot name="day-lunar" :day="row">
                    <span v-if="lang === 'zh-cn'">{{ getLunar(row, 3) }}</span>
                  </slot>
                </div>
              </div>
              <div class="day-content" :class="{ mini: currentMode === 'mini' }">
                <div
                  v-if="currentMode === 'mini' && lunar"
                  class="day-lunar"
                  :class="{ mini: currentMode === 'mini' }"
                  :style="`color:${row.color}`"
                  :title="getLunar(row)"
                >
                  <slot name="day-lunar" :day="row">
                    <span v-if="lang === 'zh-cn'">{{ getLunar(row, 3) }}</span>
                  </slot>
                </div>
                <div
                  v-if="event"
                  class="day-event"
                  :class="{ mini: currentMode === 'mini' }"
                  @mouseenter="dayEventEnter"
                  @mouseleave="dayEventLeave"
                >
                  <slot name="day-event" :day="row" :popMenu="clickEvent"></slot>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 左键菜单 -->
        <div
          :class="dayEventMenu"
          v-show="eventMenuShow"
          :style="`top:${eventMenuTop}px;left:${eventMenuLeft}px;`"
        >
          <slot name="day-event-left-menu" :eventMenuShow="eventMenuShow" :currentEvent="currentEvent">
            <div :class="dayEventMenuItem">{{ language('左键菜单插槽') }}</div>
          </slot>
        </div>

        <!-- 右键菜单 -->
        <div
          :class="dayEventMenu"
          v-show="eventRightMenuShow"
          :style="`top:${eventMenuTop}px;left:${eventMenuLeft}px;`"
        >
          <slot name="day-event-right-menu" :eventRightMenuShow="eventRightMenuShow" :currentEvent="currentEvent">
            <div :class="dayEventMenuItem" @click="appendEvent">{{ language('添加待办事项') }}</div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import cd from './js/calendar'
import english from './js/language'
import type { CalendarDay, ActivateDate } from '@/types'

// Props 定义
const props = withDefaults(
  defineProps<{
    modelValue?: string[]
    mode?: 'normal' | 'mini' | 'auto'
    max?: string
    min?: string
    offDays?: string[]
    enabledList?: string[]
    disabledList?: string[]
    activateDate?: ActivateDate
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
    defHolidayColor?: string
    overHide?: boolean
    dayEventMenu?: string
    dayEventMenuItem?: string
  }>(),
  {
    modelValue: () => [],
    mode: 'normal',
    max: '',
    min: '',
    offDays: () => [],
    enabledList: () => [],
    disabledList: () => [],
    activateDate: () => ({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 }),
    selectMode: 'list',
    pickMode: true,
    cancelClick: true,
    rightMenu: true,
    mostChoice: 0,
    crossMonth: false,
    lang: 'zh-cn',
    lunar: true,
    event: true,
    height: 'auto',
    defHolidayColor: '#E6A23C',
    overHide: false,
    dayEventMenu: 'day-event-menu',
    dayEventMenuItem: 'day-event-menu-item'
  }
)

// Emits 定义
const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  change: [value: string[]]
  'refresh-calendar': [date: { year: number; month: number }, data: CalendarDay[]]
  'append-event': [day: CalendarDay]
  'click-event': [event: MouseEvent, data: { day: CalendarDay }]
  'mouse-up': [event: MouseEvent | undefined, row: CalendarDay, index: number]
}>()

// 自定义指令
const vMenu = {
  mounted(el: HTMLElement) {
    el.oncontextmenu = () => false
  }
}

// 响应式数据
const weekTitleData = ['日', '一', '二', '三', '四', '五', '六']
const monthData = ref<CalendarDay[]>([])
const today = new Date()
const currentYear = ref(props.activateDate.year)
const currentMonth = ref(props.activateDate.month - 1)
const selectedDate = ref<string[]>([...props.modelValue])
const currentMode = ref(props.mode === 'auto' ? 'normal' : props.mode)
const showErr = ref(false)
const mouseLeftHold = ref(false)
const mouseHoldIndex = ref(0)
const mouseHoldLastIndex = ref(-1)
const mouseOverEventDiv = ref(false)
const currentEvent = ref<{ day?: CalendarDay }>({})
const eventMenuShow = ref(false)
const eventRightMenuShow = ref(false)
const eventMenuTop = ref(0)
const eventMenuLeft = ref(0)
const selectedRange = ref<string[]>([])

// Refs
const containerRef = ref<HTMLElement>()
const headerRef = ref<HTMLElement>()
const bodyRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const daysRef = ref<HTMLElement>()

// 响应式尺寸监听
useResizeObserver(containerRef, (entries) => {
  if (props.mode !== 'auto') return
  const entry = entries[0]
  if (entry.contentRect.width <= 400) {
    currentMode.value = 'mini'
  } else if (entry.contentRect.width >= 600) {
    currentMode.value = 'normal'
  }
})

// 方法
const language = (text: string): string => {
  if (props.lang === 'en' && english[text]) {
    return english[text]
  }
  return text
}

const getLunar = (day: CalendarDay, length = 999): string => {
  if (day.color) day.color = props.defHolidayColor
  const lunar = day.solarTerms || day.solarFestival || day.lunarFestival || (day.lDay === 1 ? day.lMonthChinese : day.lDayChinese) || ''
  return lunar.substr(0, length)
}

const lastMonth = () => {
  if (currentMonth.value === 0) {
    currentYear.value -= 1
    currentMonth.value = 11
  } else {
    currentMonth.value -= 1
  }
  makeCalendar()
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentYear.value += 1
    currentMonth.value = 0
  } else {
    currentMonth.value += 1
  }
  makeCalendar()
}

const makeCalendar = () => {
  const data = cd.fullMonthCalendar(currentYear.value, currentMonth.value)
  monthData.value = data.map((item) => ({ ...item, selected: false, preview: false }))
  checkSelected()
  emit('refresh-calendar', { year: currentYear.value, month: currentMonth.value + 1 }, monthData.value)
}

const hasRange = (thisDay: string): boolean => {
  try {
    const thisDayTime = new Date(thisDay).getTime()
    if (props.min) {
      const minTime = new Date(props.min + ' 00:00:00').getTime()
      if (minTime > thisDayTime) return true
    }
    if (props.max) {
      const maxTime = new Date(props.max + ' 23:59:59').getTime()
      if (maxTime < thisDayTime) return true
    }
    return false
  } catch {
    return false
  }
}

const getHoliday = (row: CalendarDay): string => {
  const color = 'color:#F56C6C;'
  if (props.offDays.length > 0) {
    return props.offDays.includes(row.sDate) ? color : ''
  }
  return row.week === '六' || row.week === '日' ? color : ''
}

const goToday = () => {
  currentYear.value = today.getFullYear()
  currentMonth.value = today.getMonth()
  makeCalendar()
}

const gotoMonth = (m: number) => {
  currentMonth.value = m - 1
  makeCalendar()
}

const changeYear = () => {
  if (currentYear.value > 1900 && currentYear.value < 2100) {
    showErr.value = false
    makeCalendar()
  } else {
    showErr.value = true
  }
}

const dayClick = (row: CalendarDay, uprow: CalendarDay) => {
  if (props.mostChoice < 0) return

  if (row.selected) {
    if (!props.cancelClick && !props.pickMode) return
    if (row.sDate === uprow.sDate && !props.cancelClick) return
    row.selected = false
  } else {
    if (props.mostChoice > 0 && selectedDate.value.length >= props.mostChoice && !props.pickMode) return
    row.selected = true
  }

  const index = selectedDate.value.indexOf(row.sDate)
  if (index >= 0) {
    if (!row.selected) selectedDate.value.splice(index, 1)
  } else {
    if (row.selected) selectedDate.value.push(row.sDate)
  }

  if (props.pickMode && props.mostChoice > 0 && selectedDate.value.length > props.mostChoice) {
    selectedDate.value.splice(0, 1)
  }
}

const dayMouseDown = (e: MouseEvent, row: CalendarDay, index: number) => {
  if (e.button === 0) {
    if (mouseOverEventDiv.value || (!props.crossMonth && currentMonth.value + 1 !== row.sMonth)) return
    if (props.mostChoice < 0) return
    mouseLeftHold.value = true
    mouseHoldIndex.value = index
    row.preview = true
  }
  if (e.button === 2 && props.rightMenu) {
    currentEvent.value = { day: row }
    eventMenuTop.value = e.clientY
    eventMenuLeft.value = e.clientX
    eventRightMenuShow.value = true
  }
}

const dayMouseMove = (e: MouseEvent, row: CalendarDay, index: number) => {
  if (mouseLeftHold.value && index !== mouseHoldLastIndex.value && props.selectMode === 'list') {
    if ((props.crossMonth || currentMonth.value + 1 === row.sMonth)) {
      row.preview = true
      mouseHoldLastIndex.value = index
    }
  }

  if (props.selectMode === 'range' && selectedRange.value.length === 1) {
    const start = new Date(`${selectedRange.value[0]} 00:00:00`).getTime()
    const startEnd = new Date(`${selectedRange.value[0]} 23:59:59`).getTime()
    const now = new Date(`${row.sDate} 00:00:00`).getTime()
    const nowEnd = new Date(`${row.sDate} 23:59:59`).getTime()

    monthData.value.forEach((element) => {
      const thisDate = new Date(element.sDate).getTime()
      if (now >= start) {
        element.preview = thisDate >= start && thisDate <= nowEnd
      } else {
        element.preview = thisDate < startEnd && thisDate >= now
      }
    })
  }
}

const dayMouseUp = (e?: MouseEvent, row?: CalendarDay, index?: number) => {
  mouseLeftHold.value = false
  if (index === undefined || !row) return

  if (props.selectMode === 'list') {
    monthData.value.forEach((item) => {
      if (item.preview) {
        item.preview = false
        dayClick(item, row)
      }
    })
  }

  if (props.selectMode === 'range') {
    if (selectedRange.value.length < 2) {
      selectedRange.value.push(row.sDate)
    } else {
      selectedRange.value = [row.sDate]
      unAllSelected()
    }
    if (selectedRange.value.length === 2) {
      const range = [...selectedRange.value].sort()
      selectedDate.value = [range[0], range[range.length - 1]]
    }
  }

  emit('mouse-up', e, row, index)
}

const unAllSelected = () => {
  monthData.value.forEach((element) => {
    element.selected = false
  })
}

const checkSelected = () => {
  monthData.value.forEach((item) => {
    if (props.selectMode === 'list') {
      item.selected = selectedDate.value.includes(item.sDate)
    }
    if (props.selectMode === 'range') {
      const range = [...selectedDate.value].sort()
      const thisDate = new Date(item.sDate).getTime()
      const start = new Date(`${range[0]} 00:00:00`).getTime()
      const end = new Date(`${range[range.length - 1]} 23:59:59`).getTime()
      item.preview = false
      item.selected = thisDate >= start && thisDate <= end
    }
  })
}

const dayEventEnter = () => {
  mouseOverEventDiv.value = true
}

const dayEventLeave = () => {
  mouseOverEventDiv.value = false
}

const appendEvent = () => {
  if (currentEvent.value.day) {
    emit('append-event', currentEvent.value.day)
  }
}

const clickEvent = (e: MouseEvent, data: { day: CalendarDay }) => {
  if (!e || !data?.day) return
  currentEvent.value = data
  eventMenuTop.value = e.clientY
  eventMenuLeft.value = e.clientX
  eventMenuShow.value = true
  emit('click-event', e, data)
}

const eventListenerMouseUp = (e: MouseEvent) => {
  if (e.button === 0) {
    mouseLeftHold.value = false
    eventMenuShow.value = false
    eventRightMenuShow.value = false
  }
  if (e.button === 2) {
    mouseLeftHold.value = false
    eventMenuShow.value = false
  }
  dayMouseUp()
}

// 防止循环更新的标记
let isInternalUpdate = false

// Watchers
watch(
  () => props.modelValue,
  (val) => {
    isInternalUpdate = true
    selectedDate.value = [...val]
    checkSelected()
    nextTick(() => {
      isInternalUpdate = false
    })
  }
)

watch(selectedDate, (val) => {
  if (isInternalUpdate) return
  emit('update:modelValue', val)
  emit('change', val)
}, { deep: true })

watch(
  () => props.activateDate,
  (val) => {
    currentYear.value = val.year
    currentMonth.value = val.month - 1
    makeCalendar()
  }
)

watch(
  () => props.mode,
  (val) => {
    if (val !== 'auto') {
      currentMode.value = val
    }
  }
)

// 生命周期
onMounted(() => {
  window.document.addEventListener('mouseup', eventListenerMouseUp)
  makeCalendar()
})

onBeforeUnmount(() => {
  window.document.removeEventListener('mouseup', eventListenerMouseUp)
})

// 暴露方法给父组件
defineExpose({
  unAllSelected
})
</script>

<style scoped>
@import './style/icon.css';
@import './style/normal.css';
@import './style/mini.css';
</style>
