<script setup lang="ts">
import { computed, ref } from 'vue'
import BehaviorVerifySlide from './BehaviorVerifySlide.vue'
import type {
  BehaviorVerifyCaptchaType,
  BehaviorVerifyExpose,
  BehaviorVerifyMode,
  BehaviorVerifySize,
  BehaviorVerifySuccessPayload,
} from './types'

interface Props {
  // 验证码类型
  captchaType?: BehaviorVerifyCaptchaType

  // 展示模式
  mode?: BehaviorVerifyMode

  // 提示文案
  explain?: string

  // 图片区域尺寸
  imgSize?: BehaviorVerifySize

  // 滑块条尺寸
  barSize?: BehaviorVerifySize
}

const props = withDefaults(defineProps<Props>(), {
  captchaType: 'blockPuzzle',
  mode: 'pop',
  explain: '向右滑动完成验证',
  imgSize: () => ({
    width: '330px',
    height: '168px',
  }),
  barSize: () => ({
    width: '330px',
    height: '44px',
  }),
})

const emit = defineEmits<{
  (e: 'success', payload: BehaviorVerifySuccessPayload): void
  (e: 'error', message: string): void
}>()

// 弹窗模式下控制验证码面板显隐
const visible = ref(props.mode !== 'pop')

// 内部滑块组件实例，外部刷新时会复用它
const slideRef = ref<InstanceType<typeof BehaviorVerifySlide>>()

// 当前是否需要显示弹层
const showBox = computed(() => (props.mode === 'pop' ? visible.value : true))

function show() {
  if (props.mode === 'pop') {
    visible.value = true
  }

  slideRef.value?.refresh()
}

function close() {
  if (props.mode === 'pop') {
    visible.value = false
  }
}

function refresh() {
  slideRef.value?.refresh()
}

function handleSuccess(payload: BehaviorVerifySuccessPayload) {
  close()
  emit('success', payload)
}

defineExpose<BehaviorVerifyExpose>({
  show,
  close,
  refresh,
})
</script>

<template>
  <div v-show="showBox" :class="{ 'behavior-verify__mask': props.mode === 'pop' }">
    <div
      class="behavior-verify"
      :class="{ 'behavior-verify--pop': props.mode === 'pop' }"
      :style="{ maxWidth: `${Number.parseInt(props.imgSize.width, 10) + 32}px` }"
    >
      <div v-if="props.mode === 'pop'" class="behavior-verify__header">
        <span>请完成安全验证</span>
        <button type="button" class="behavior-verify__close" @click="close">×</button>
      </div>

      <div class="behavior-verify__body">
        <BehaviorVerifySlide
          ref="slideRef"
          :captcha-type="props.captchaType"
          :explain="props.explain"
          :img-size="props.imgSize"
          :bar-size="props.barSize"
          @success="handleSuccess"
          @error="emit('error', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.behavior-verify__mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.36);
}

.behavior-verify {
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.24);
}

.behavior-verify--pop {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100vw - 32px);
}

.behavior-verify__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  color: #102a43;
  font-size: 16px;
  font-weight: 600;
}

.behavior-verify__close {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #64748b;
  font-size: 20px;
  cursor: pointer;
}

.behavior-verify__body {
  padding: 18px;
}

@media (max-width: 480px) {
  .behavior-verify__header {
    padding: 16px;
    font-size: 15px;
  }

  .behavior-verify__body {
    padding: 14px;
  }
}
</style>
