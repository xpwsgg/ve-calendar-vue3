/**
 * ve-calendar Vue 3 日历组件
 * @author pcloth
 * @version 1.0.0
 */

import type { App } from 'vue'
import VeCalendar from './ve-calendar.vue'
import VeYear from './ve-year.vue'
import VeDatePicker from './ve-date-picker/index.vue'

// 导出类型
export type { CalendarDay, ActivateDate, VeCalendarProps, VeCalendarEmits } from '@/types'

// 导出组件
export { VeCalendar, VeYear, VeDatePicker }

// 导出日历计算工具
export { default as calendar } from './js/calendar'

// 所有组件列表
const components = [VeCalendar, VeYear, VeDatePicker]

// 插件安装方法
export function install(app: App) {
  components.forEach(component => {
    app.component(component.name || component.__name, component)
  })
}

// 默认导出插件对象
export default {
  install,
  VeCalendar,
  VeYear,
  VeDatePicker
}
