<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  // loading 提示文案
  tip?: string

  // 占位区域高度，保证不同页面都能居中展示
  minHeight?: number | string

  // 少数场景需要浅底色承接 loading 时可以传入
  background?: string
}

const props = withDefaults(defineProps<Props>(), {
  tip: '加载中...',
  minHeight: 320,
  background: 'transparent',
})

// 数字高度统一补成 px，字符串则按外部传入原样使用
const wrapperStyle = computed(() => ({
  minHeight: typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight,
  background: props.background,
}))
</script>

<template>
  <div class="app-loading" :style="wrapperStyle">
    <a-spin :loading="true" :tip="props.tip" />
  </div>
</template>

<style scoped lang="less">
.app-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 12px;
}
</style>
