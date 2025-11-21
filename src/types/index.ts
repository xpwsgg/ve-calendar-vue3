/**
 * ve-calendar Vue 3 类型定义
 */

// 日历日期数据对象
export interface CalendarDay {
  cYear: string;          // 天干地支年
  cMonth: string;         // 天干地支月
  cDay: string;           // 天干地支日
  lunarFestival: string;  // 农历节日
  lYear: number;          // 农历年
  lMonth: number;         // 农历月
  lDay: number;           // 农历日
  Animal: string;         // 生肖
  lMonthChinese: string;  // 农历月份中文
  lDayChinese: string;    // 农历日期中文
  sYear: number;          // 公历年
  sMonth: number;         // 公历月
  sDay: number;           // 公历日
  sDate: string;          // 公历日期字符串 YYYY-MM-DD
  isToday: boolean;       // 是否今天
  isLeap: boolean;        // 是否闰月
  nWeek: number;          // 星期几(数字)
  week: string;           // 星期几(中文)
  weekCount: number;      // 本月第几个该星期
  isTerm: boolean;        // 是否节气
  solarTerms: string | null; // 节气名称
  solarFestival: string;  // 公历节日
  color: string;          // 节日颜色
  astro: string;          // 星座
  selected?: boolean;     // 是否选中
  preview?: boolean;      // 是否预览选中
}

// 激活日期对象
export interface ActivateDate {
  year: number;
  month: number;
}

// 复活节日期
export interface EasterDate {
  year: number;
  month: number;
  day: number;
}

// 组件 Props
export interface VeCalendarProps {
  modelValue?: string[];
  mode?: 'normal' | 'mini' | 'auto';
  max?: string;
  min?: string;
  offDays?: string[];
  enabledList?: string[];
  disabledList?: string[];
  activateDate?: ActivateDate;
  selectMode?: 'list' | 'range';
  pickMode?: boolean;
  cancelClick?: boolean;
  rightMenu?: boolean;
  mostChoice?: number;
  crossMonth?: boolean;
  lang?: 'zh-cn' | 'en';
  lunar?: boolean;
  event?: boolean;
  height?: string;
  defHolidayColor?: string;
  overHide?: boolean;
}

// 组件 Emits
export interface VeCalendarEmits {
  (e: 'update:modelValue', value: string[]): void;
  (e: 'change', value: string[]): void;
  (e: 'refresh-calendar', date: { year: number; month: number }, data: CalendarDay[]): void;
  (e: 'append-event', day: CalendarDay): void;
  (e: 'click-event', event: MouseEvent, data: { day: CalendarDay }): void;
  (e: 'mouse-up', event: MouseEvent | undefined, row: CalendarDay, index: number): void;
}

// 语言映射
export type LanguageMap = Record<string, string>;
