# ve-calendar-vue3

Vue 3 日历组件，支持农历、节气、节日、多选、范围选择等功能。

## 项目来源

本项目从 [ve-calendar](https://github.com/pcloth/ve-calendar) 复刻而来，完全使用 Vue 3 Composition API + TypeScript 重写。

- **原项目地址**: https://github.com/pcloth/ve-calendar
- **重构工具**: 使用 Claude Code 进行代码重构
- **代码审核**: 经过 Codex 代码审核
- **作者**: Xiao
- **联系方式**: xpwsgg@gmail.com

## 特性

- ✅ Vue 3 + TypeScript
- ✅ Composition API
- ✅ 农历、节气、节日显示
- ✅ 多选模式
- ✅ 范围选择模式
- ✅ 自定义休息日
- ✅ 自适应模式 (normal/mini/auto)
- ✅ 年视图组件 (VeYear)
- ✅ 日期选择器组件 (VeDatePicker)
- ✅ 中英文支持
- ✅ 完整的类型定义

## 预览

![ve-calendar Vue 3 示例](./docs/screenshot.png)

## 安装

```bash
# pnpm
pnpm add ve-calendar-vue3

# npm
npm install ve-calendar-vue3

# yarn
yarn add ve-calendar-vue3
```

## 使用

### 全局注册

```typescript
import { createApp } from 'vue'
import VeCalendar from 've-calendar-vue3'
import 've-calendar-vue3/dist/style.css'

const app = createApp(App)
app.use(VeCalendar)
app.mount('#app')
```

### 局部注册

```vue
<template>
  <!-- 日历组件 -->
  <VeCalendar v-model="selectedDates" @change="handleChange" />

  <!-- 年视图组件 -->
  <VeYear v-model="yearDates" :year="2024" />

  <!-- 日期选择器组件 -->
  <VeDatePicker v-model="pickerDate" placeholder="请选择日期" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VeCalendar, VeYear, VeDatePicker } from 've-calendar-vue3'
import 've-calendar-vue3/dist/style.css'

const selectedDates = ref<string[]>([])
const yearDates = ref<string[]>([])
const pickerDate = ref('')

const handleChange = (dates: string[]) => {
  console.log('选中日期:', dates)
}
</script>
```

## 组件

### VeCalendar - 日历组件

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | string[] | [] | 选中的日期数组 |
| mode | 'normal' \| 'mini' \| 'auto' | 'normal' | 显示模式 |
| lang | 'zh-cn' \| 'en' | 'zh-cn' | 语言 |
| lunar | boolean | true | 是否显示农历 |
| selectMode | 'list' \| 'range' | 'list' | 选择模式 |
| mostChoice | number | 0 | 最多选择数量，0为无限 |
| offDays | string[] | [] | 自定义休息日 |
| min | string | '' | 最小可选日期 |
| max | string | '' | 最大可选日期 |
| activateDate | { year: number, month: number } | 当前日期 | 激活的年月 |
| crossMonth | boolean | false | 是否允许跨月选择 |
| overHide | boolean | false | 是否隐藏非本月日期 |
| event | boolean | true | 是否显示事件区域 |
| rightMenu | boolean | true | 是否显示右键菜单 |
| cancelClick | boolean | true | 是否允许点击取消选中 |
| pickMode | boolean | true | 是否为拾取模式 |
| height | string | 'auto' | 组件高度 |
| defHolidayColor | string | '#E6A23C' | 节日颜色 |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | string[] | 选中日期变化 |
| change | string[] | 选中日期变化 |
| refresh-calendar | { year, month }, CalendarDay[] | 日历刷新 |
| append-event | CalendarDay | 添加事件 |
| click-event | MouseEvent, { day: CalendarDay } | 点击事件 |
| mouse-up | MouseEvent, CalendarDay, number | 鼠标抬起 |

#### Slots

| 插槽名 | 参数 | 说明 |
|--------|------|------|
| header | { year, month } | 自定义头部 |
| day-number | { day } | 自定义日期数字 |
| day-lunar | { day } | 自定义农历显示 |
| day-event | { day, popMenu } | 自定义事件区域 |
| day-event-left-menu | { eventMenuShow, currentEvent } | 自定义左键菜单 |
| day-event-right-menu | { eventRightMenuShow, currentEvent } | 自定义右键菜单 |

### VeYear - 年视图组件

展示一整年的日历，以 12 个月的迷你日历形式展示。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | string[] | [] | 选中的日期数组 |
| year | number | 当前年份 | 显示的年份 |
| mode | string | 'mini' | 显示模式（固定为 mini） |
| offDays | string[] | [] | 自定义休息日 |
| enabledList | string[] | [] | 只准选择名单中的日期 |
| disabledList | string[] | [] | 禁止选中的日期 |
| selectMode | 'list' \| 'range' | 'list' | 选择模式 |
| pickMode | boolean | true | 是否为拾取模式 |
| cancelClick | boolean | true | 是否允许点击取消选中 |
| rightMenu | boolean | true | 是否显示右键菜单 |
| mostChoice | number | 0 | 最多选择数量，0为无限 |
| crossMonth | boolean | false | 是否允许跨月选择 |
| lang | 'zh-cn' \| 'en' | 'zh-cn' | 语言 |
| lunar | boolean | false | 是否显示农历 |
| event | boolean | false | 是否显示事件区域 |
| height | string | '300px' | 每个月历的高度 |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | string[] | 选中日期变化 |
| change | string[] | 选中日期变化 |

#### Methods

| 方法名 | 说明 |
|--------|------|
| unAllSelected | 取消所有选中 |

#### 示例

```vue
<template>
  <VeYear v-model="selectedDates" :year="2024" height="250px" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VeYear } from 've-calendar-vue3'

const selectedDates = ref<string[]>([])
</script>
```

### VeDatePicker - 日期选择器组件

带输入框的日期选择器，点击输入框弹出日历面板。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | string[] | [] | 选中的日期数组 |
| placeholder | string | '请选择日期' | 输入框占位文本 |
| offDays | string[] | [] | 自定义休息日 |
| enabledList | string[] | [] | 只准选择名单中的日期 |
| disabledList | string[] | [] | 禁止选中的日期 |
| dayEvent | string | 'day-event' | 待办事项区域 class name |
| dayEventMenu | string | 'day-event-menu' | 弹出菜单 class name |
| dayEventMenuItem | string | 'day-event-menu-item' | 菜单项 class name |
| overHide | boolean | true | 是否隐藏非本月日期 |
| activateDate | { year: number, month: number } | 当前日期 | 激活的年月 |
| selectMode | 'list' \| 'range' | 'list' | 选择模式 |
| pickMode | boolean | true | 是否为拾取模式 |
| cancelClick | boolean | true | 是否允许点击取消选中 |
| rightMenu | boolean | false | 是否显示右键菜单 |
| mostChoice | number | 0 | 最多选择数量，0为无限 |
| crossMonth | boolean | false | 是否允许跨月选择 |
| lang | 'zh-cn' \| 'en' | 'zh-cn' | 语言 |
| lunar | boolean | true | 是否显示农历 |
| event | boolean | true | 是否显示事件区域 |
| height | string | '330px' | 日历面板高度 |
| valueFormat | string | 'yyyy-MM-dd' | 日期格式 |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | string[] | 选中日期数组变化 |
| change | string[] | 选中日期数组变化 |

#### 示例

```vue
<template>
  <!-- 单选模式 -->
  <VeDatePicker v-model="date" placeholder="请选择日期" />
  <p>选中日期: {{ date.join(', ') }}</p>

  <!-- 范围选择 -->
  <VeDatePicker
    v-model="dateRange"
    selectMode="range"
    placeholder="请选择日期范围"
  />
  <p>选中范围: {{ dateRange.join(' ~ ') }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VeDatePicker } from 've-calendar-vue3'

const date = ref<string[]>([])
const dateRange = ref<string[]>([])
</script>
```

## 类型定义

```typescript
interface CalendarDay {
  sYear: number       // 公历年
  sMonth: number      // 公历月
  sDay: number        // 公历日
  sDate: string       // 日期字符串 YYYY-MM-DD
  lYear: number       // 农历年
  lMonth: number      // 农历月
  lDay: number        // 农历日
  lMonthChinese: string  // 农历月份中文
  lDayChinese: string    // 农历日期中文
  week: string        // 星期中文
  nWeek: number       // 星期数字
  isToday: boolean    // 是否今天
  isTerm: boolean     // 是否节气
  solarTerms: string | null  // 节气名称
  solarFestival: string  // 公历节日
  lunarFestival: string  // 农历节日
  Animal: string      // 生肖
  astro: string       // 星座
  selected?: boolean  // 是否选中
  preview?: boolean   // 是否预览
}
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查
pnpm typecheck

# 构建库
pnpm build:lib
```

## License

MIT © [Xiao](mailto:xpwsgg@gmail.com)

## 致谢

感谢 [pcloth](https://github.com/pcloth) 开发的原始 [ve-calendar](https://github.com/pcloth/ve-calendar) 项目。本项目在原项目基础上进行了 Vue 3 重构。
