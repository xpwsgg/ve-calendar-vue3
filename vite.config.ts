import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
  // 库模式构建
  if (mode === 'lib') {
    return {
      plugins: [
        vue(),
        dts({
          include: ['src/lib/**/*.ts', 'src/lib/**/*.vue', 'src/types/**/*.ts'],
          outDir: 'dist/types'
        })
      ],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/lib/index.ts'),
          name: 'VeCalendar',
          fileName: 've-calendar'
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue'
            }
          }
        }
      }
    }
  }

  // 开发模式
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      port: 3000,
      open: true
    }
  }
})
