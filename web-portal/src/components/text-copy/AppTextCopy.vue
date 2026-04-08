<script setup lang="ts">
import { computed } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconCopy } from '@arco-design/web-vue/es/icon'

defineOptions({ name: 'AppTextCopy' })

interface Props {
  // 需要展示和复制的文本内容
  content?: string | number | null

  // 内容为空时展示的占位文案
  emptyText?: string

  // 复制成功后的提示文案
  successText?: string

  // 复制按钮的提示文案
  tooltip?: string
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  emptyText: '--',
  successText: '复制成功',
  tooltip: '复制',
})

// 统一把传入内容转成可复制的字符串
const normalizedContent = computed(() => {
  if (props.content === null || props.content === undefined) {
    return ''
  }

  return String(props.content).trim()
})

// 页面展示用文本，空值时回退占位文案
const displayText = computed(() => normalizedContent.value || props.emptyText)

// 只有真实内容时才展示复制入口
const canCopy = computed(() => Boolean(normalizedContent.value))

// 兼容非安全上下文时的复制兜底方案
function copyByCommand(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', 'true')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

// 点击后优先走原生剪贴板接口，失败时回退到老方案
async function handleCopy() {
  if (!canCopy.value) {
    return
  }

  try {
    if (window.isSecureContext && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(normalizedContent.value)
    } else {
      copyByCommand(normalizedContent.value)
    }

    Message.success(props.successText)
  } catch {
    Message.error('复制失败，请手动复制')
  }
}
</script>

<template>
  <div class="app-text-copy" :class="{ 'is-disabled': !canCopy }">
    <span class="app-text-copy__text">{{ displayText }}</span>

    <a-tooltip v-if="canCopy" :content="tooltip">
      <button
        type="button"
        class="app-text-copy__button"
        aria-label="复制文本"
        @click="void handleCopy()"
      >
        <IconCopy />
      </button>
    </a-tooltip>
  </div>
</template>

<style scoped lang="less">
.app-text-copy {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  min-width: 0;

  &.is-disabled {
    .app-text-copy__text {
      color: #94a3b8;
    }
  }
}

.app-text-copy__text {
  color: #0f172a;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  word-break: break-all;
}

.app-text-copy__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #3b82f6;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
    color: #2563eb;
  }
}
</style>
