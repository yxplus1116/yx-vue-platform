import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'

// 代理前缀可能带有正则特殊字符，先转义后再拼接到 RegExp 里更稳妥
function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const apiPrefix = env.VITE_API_PREFIX || '/dev-api'
  const apiProxyTarget =
    env.VITE_API_PROXY_TARGET || env.VITE_API_BASE_URL || 'http://localhost:8080'
  const apiPrefixPattern = new RegExp(`^${escapeRegExp(apiPrefix)}`)

  return {
    // 开发或生产环境服务的公共基础路径
    base: env.VITE_BASE || '/',
    resolve: {
      alias: {
        // 项目根目录，适合配置文件或根级资源引用
        '~': fileURLToPath(new URL('./', import.meta.url)),

        // src 根目录，业务代码统一从这里开始找
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: true,
      port: 5173,
      proxy: {
        // 开发环境接口代理，跟 admin 保持同一套处理方式
        [apiPrefix]: {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(apiPrefixPattern, ''),
        },
      },
    },
    plugins: [
      vue(),
      Components({
        dts: 'src/components.d.ts',
        resolvers: [
          ArcoResolver({
            importStyle: 'css',
            resolveIcons: true,
          }),
        ],
      }),
    ],
    // 构建输出和压缩策略尽量跟 admin 保持一致
    build: {
      chunkSizeWarningLimit: 2000,
      outDir: 'dist',
      minify: 'terser',
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: true,
          drop_debugger: true,
        },
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    envPrefix: ['VITE', 'FILE'],
  }
})
