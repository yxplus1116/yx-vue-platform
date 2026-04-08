<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { checkBehaviorCaptcha, getBehaviorCaptcha } from '@/apis'
import { encryptByAes } from '@/utils/encrypt'
import { resetVerifySize } from '@/utils/verify'
import type {
  BehaviorVerifyCaptchaType,
  BehaviorVerifySize,
  BehaviorVerifySuccessPayload,
} from './types'

interface Props {
  // 行为验证码类型
  captchaType?: BehaviorVerifyCaptchaType

  // 验证码说明文案
  explain?: string

  // 图片区域尺寸
  imgSize?: BehaviorVerifySize

  // 滑块条尺寸
  barSize?: BehaviorVerifySize
}

const props = withDefaults(defineProps<Props>(), {
  captchaType: 'blockPuzzle',
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

// 验证组件根节点，用于换算百分比尺寸
const rootRef = ref<HTMLElement>()

// 滑块条节点，拖拽时会用它计算当前位置
const barRef = ref<HTMLElement>()

// 背景图 base64
const backImgBase = ref('')

// 滑块图 base64
const blockBackImgBase = ref('')

// 后端签发的 token
const token = ref('')

// 后端返回的 AES 秘钥
const secretKey = ref('')

// 滑块是否正在拖动
const dragging = ref(false)

// 当前验证是否已经成功
const verified = ref(false)

// 开始拖动时间，用来展示成功耗时
const startMoveTime = ref(0)

// 结束拖动时间
const endMoveTime = ref(0)

// 提示文案
const tipWords = ref('')

// 滑块条主文案
const text = ref(props.explain)

// 是否展示刷新按钮
const showRefresh = ref(true)

// 滑块左侧偏移
const moveBlockLeft = ref(0)

// 已填充进度条宽度
const leftBarWidth = ref(0)

// 拖动起始点
const startLeft = ref(0)

// 滑块区域尺寸
const size = reactive({
  imgWidth: props.imgSize.width,
  imgHeight: props.imgSize.height,
  barWidth: props.barSize.width,
  barHeight: props.barSize.height,
})

// 进度条边框颜色，成功失败时会切换
const leftBarBorderColor = ref('#d7e3f6')

// 滑块按钮背景色
const moveBlockBackgroundColor = ref('#ffffff')

// 图标颜色
const iconColor = ref('#2563eb')

// 当前图标字符
const iconText = ref('>')

// 成功提示背景样式
const tipClass = computed(() => (verified.value ? 'is-success' : 'is-error'))

// 小滑块显示位置
const subBlockStyle = computed(() => ({
  width: `${Math.floor((Number.parseInt(size.imgWidth, 10) * 47) / 310)}px`,
  height: size.imgHeight,
  top: `-${Number.parseInt(size.imgHeight, 10) + 10}px`,
}))

function syncSize() {
  if (!rootRef.value) {
    return
  }

  const nextSize = resetVerifySize({
    root: rootRef.value,
    imgSize: props.imgSize,
    barSize: props.barSize,
  })

  size.imgWidth = nextSize.imgWidth
  size.imgHeight = nextSize.imgHeight
  size.barWidth = nextSize.barWidth
  size.barHeight = nextSize.barHeight
}

// 请求一组新的滑块验证图片
async function loadBehaviorCaptcha() {
  const response = await getBehaviorCaptcha({
    captchaType: props.captchaType,
  })

  backImgBase.value = response.data.originalImageBase64
  blockBackImgBase.value = response.data.jigsawImageBase64
  token.value = response.data.token
  secretKey.value = response.data.secretKey
}

// 把滑块状态恢复到初始值，并重新拉验证码资源
async function refresh() {
  verified.value = false
  dragging.value = false
  showRefresh.value = true
  moveBlockLeft.value = 0
  leftBarWidth.value = 0
  leftBarBorderColor.value = '#d7e3f6'
  moveBlockBackgroundColor.value = '#ffffff'
  iconColor.value = '#2563eb'
  iconText.value = '>'
  tipWords.value = ''
  text.value = props.explain

  await nextTick()
  syncSize()
  await loadBehaviorCaptcha()
}

function clearTipWithDelay(delay = 1200) {
  window.setTimeout(() => {
    tipWords.value = ''
  }, delay)
}

function getClientX(event: MouseEvent | TouchEvent) {
  if ('touches' in event) {
    return event.touches[0]?.pageX || 0
  }

  return event.clientX
}

function move(event: MouseEvent | TouchEvent) {
  if (!dragging.value || verified.value || !barRef.value) {
    return
  }

  const clientX = getClientX(event)
  const barLeft = barRef.value.getBoundingClientRect().left
  const blockHalfWidth = Number.parseInt(size.barHeight, 10) / 2
  const maxLeft = barRef.value.offsetWidth - blockHalfWidth - 2

  let nextLeft = clientX - barLeft

  if (nextLeft >= maxLeft) {
    nextLeft = maxLeft
  }

  if (nextLeft <= blockHalfWidth) {
    nextLeft = blockHalfWidth
  }

  moveBlockLeft.value = nextLeft - startLeft.value
  leftBarWidth.value = nextLeft - startLeft.value
}

async function end() {
  if (!dragging.value || verified.value) {
    dragging.value = false
    return
  }

  dragging.value = false
  endMoveTime.value = Date.now()

  let moveLeftDistance = moveBlockLeft.value
  moveLeftDistance = (moveLeftDistance * 310) / Number.parseInt(size.imgWidth, 10)

  const point = { x: moveLeftDistance, y: 5.0 }
  const response = await checkBehaviorCaptcha({
    captchaType: props.captchaType,
    pointJson: secretKey.value ? encryptByAes(JSON.stringify(point), secretKey.value) : JSON.stringify(point),
    token: token.value,
  })

  if (response.data.repCode === '0000') {
    verified.value = true
    showRefresh.value = false
    moveBlockBackgroundColor.value = '#16a34a'
    leftBarBorderColor.value = '#16a34a'
    iconColor.value = '#ffffff'
    iconText.value = '✓'
    tipWords.value = `${((endMoveTime.value - startMoveTime.value) / 1000).toFixed(2)}s 验证成功`
    text.value = '验证成功'

    const captchaVerification = secretKey.value
      ? encryptByAes(`${token.value}---${JSON.stringify(point)}`, secretKey.value)
      : `${token.value}---${JSON.stringify(point)}`

    emit('success', { captchaVerification })
    clearTipWithDelay()
    return
  }

  moveBlockBackgroundColor.value = '#dc2626'
  leftBarBorderColor.value = '#dc2626'
  iconColor.value = '#ffffff'
  iconText.value = '×'
  tipWords.value = response.data.repMsg || '验证失败，请重试'
  text.value = '验证失败，请重试'
  emit('error', tipWords.value)

  window.setTimeout(() => {
    void refresh()
  }, 900)
}

function start(event: MouseEvent | TouchEvent) {
  if (verified.value || !barRef.value) {
    return
  }

  const clientX = getClientX(event)
  startLeft.value = Math.floor(clientX - barRef.value.getBoundingClientRect().left)
  startMoveTime.value = Date.now()
  dragging.value = true
  text.value = ''
  moveBlockBackgroundColor.value = '#2563eb'
  leftBarBorderColor.value = '#2563eb'
  iconColor.value = '#ffffff'
}

function handleMouseMove(event: MouseEvent) {
  move(event)
}

function handleTouchMove(event: TouchEvent) {
  move(event)
}

function handleMouseUp() {
  void end()
}

function handleTouchEnd() {
  void end()
}

onMounted(() => {
  syncSize()
  void refresh()
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
  window.addEventListener('touchmove', handleTouchMove)
  window.addEventListener('touchend', handleTouchEnd)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchend', handleTouchEnd)
})

defineExpose({
  refresh,
})
</script>

<template>
  <div ref="rootRef" class="behavior-verify-slide">
    <div class="behavior-verify-slide__image-wrap" :style="{ height: size.imgHeight }">
      <div class="behavior-verify-slide__image" :style="{ width: size.imgWidth, height: size.imgHeight }">
        <img :src="`data:image/png;base64,${backImgBase}`" alt="行为验证码背景图" />

        <button v-if="showRefresh" type="button" class="behavior-verify-slide__refresh" @click="refresh">
          ↻
        </button>

        <transition name="behavior-verify-tip">
          <span v-if="tipWords" class="behavior-verify-slide__tip" :class="tipClass">{{ tipWords }}</span>
        </transition>
      </div>
    </div>

    <div ref="barRef" class="behavior-verify-slide__bar"
      :style="{ width: size.barWidth, height: size.barHeight, lineHeight: size.barHeight }">
      <span class="behavior-verify-slide__bar-text">{{ text }}</span>

      <div class="behavior-verify-slide__bar-progress"
        :style="{ width: `${leftBarWidth || Number.parseInt(size.barHeight, 10)}px`, height: size.barHeight, borderColor: leftBarBorderColor }">
        <div class="behavior-verify-slide__handler"
          :style="{ width: size.barHeight, height: size.barHeight, left: `${moveBlockLeft}px`, backgroundColor: moveBlockBackgroundColor }"
          @mousedown="start" @touchstart="start">
          <span :style="{ color: iconColor }">{{ iconText }}</span>

          <div v-if="blockBackImgBase" class="behavior-verify-slide__sub-block" :style="subBlockStyle">
            <img :src="`data:image/png;base64,${blockBackImgBase}`" alt="行为验证码滑块" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.behavior-verify-slide {
  position: relative;
}

.behavior-verify-slide__image-wrap {
  position: relative;
  margin-bottom: 10px;
}

.behavior-verify-slide__image {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: #eff6ff;
}

.behavior-verify-slide__image img {
  display: block;
  width: 100%;
  height: 100%;
  user-select: none;
  -webkit-user-drag: none;
}

.behavior-verify-slide__refresh {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.62);
  color: #ffffff;
  cursor: pointer;
}

.behavior-verify-slide__tip {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 34px;
  color: #ffffff;
  font-size: 13px;
  line-height: 34px;
  text-align: center;
}

.behavior-verify-slide__tip.is-success {
  background: rgba(22, 163, 74, 0.82);
}

.behavior-verify-slide__tip.is-error {
  background: rgba(220, 38, 38, 0.78);
}

.behavior-verify-slide__bar {
  position: relative;
  overflow: visible;
  border-radius: 4px;
  background: #f8fafc;
  box-shadow: inset 0 0 0 1px #d7e3f6;
}

.behavior-verify-slide__bar-text {
  position: absolute;
  inset: 0;
  z-index: 0;
  color: #64748b;
  font-size: 14px;
  text-align: center;
}

.behavior-verify-slide__bar-progress {
  position: relative;
  min-width: 44px;
  border: 1px solid;
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.08);
}

.behavior-verify-slide__handler {
  position: absolute;
  top: -1px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.16);
  cursor: grab;
  user-select: none;
}

.behavior-verify-slide__handler span {
  font-size: 18px;
  font-weight: 700;
}

.behavior-verify-slide__sub-block {
  position: absolute;
  overflow: hidden;
  border-radius: 8px;
  pointer-events: none;
}

.behavior-verify-slide__sub-block img {
  display: block;
  width: 100%;
  height: 100%;
  user-select: none;
  -webkit-user-drag: none;
}

.behavior-verify-tip-enter-active,
.behavior-verify-tip-leave-active {
  transition: bottom 0.24s ease;
}

.behavior-verify-tip-enter-from,
.behavior-verify-tip-leave-to {
  bottom: -34px;
}

@media (max-width: 480px) {
  .behavior-verify-slide__bar-text {
    font-size: 13px;
  }
}
</style>
