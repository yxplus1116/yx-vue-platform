<template>
  <span v-if="!imageList.length" class="gi-image-preview__empty">{{ props.emptyText }}</span>

  <div v-else-if="!isGroup" class="gi-image-preview__card" :class="{ 'is-previewable': props.preview }"
    :style="containerStyle">
    <a-image :src="imageList[0]" :alt="props.alt" :width="props.width" :height="props.height" :fit="props.fit"
      :preview="props.preview" class="gi-image-preview gi-image-preview--single">
      <template #error>
        <div class="gi-image-preview__placeholder" :style="placeholderStyle">加载失败</div>
      </template>
    </a-image>
    <div v-if="props.preview" class="gi-image-preview__mask">
      <span class="gi-image-preview__mask-icon">
        <icon-eye :size="18" />
      </span>
      <span class="gi-image-preview__mask-text">查看大图</span>
    </div>
  </div>

  <a-image-preview-group v-else>
    <div class="gi-image-preview gi-image-preview--group" :style="groupStyle">
      <div v-for="(image, index) in imageList" :key="`${image}-${index}`" class="gi-image-preview__card"
        :class="{ 'is-previewable': props.preview }" :style="containerStyle">
        <a-image :src="image" :alt="props.alt" :width="props.width" :height="props.height" :fit="props.fit"
          :preview="props.preview" class="gi-image-preview__item">
          <template #error>
            <div class="gi-image-preview__placeholder" :style="placeholderStyle">加载失败</div>
          </template>
        </a-image>
        <div v-if="props.preview" class="gi-image-preview__mask">
          <span class="gi-image-preview__mask-icon">
            <icon-eye :size="18" />
          </span>
          <span class="gi-image-preview__mask-text">查看大图</span>
        </div>
      </div>
    </div>
  </a-image-preview-group>
</template>

<script setup lang="ts">
// 图片缩略图填充方式
export type GiImagePreviewFitType = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'

// 公共图片预览组件参数
export interface GiImagePreviewProps {
  // 单张图片地址
  src?: string

  // 图集图片地址列表
  images?: string[]

  // 图片替代文案
  alt?: string

  // 缩略图宽度
  width?: number | string

  // 缩略图高度
  height?: number | string

  // 缩略图圆角
  radius?: number | string

  // 缩略图填充方式
  fit?: GiImagePreviewFitType

  // 图集缩略图之间的间距
  gap?: number

  // 是否开启点击预览
  preview?: boolean

  // 没有图片时的占位文案
  emptyText?: string
}

const props = withDefaults(defineProps<GiImagePreviewProps>(), {
  src: '',
  images: () => [],
  alt: '图片预览',
  width: 160,
  height: 100,
  radius: 6,
  fit: 'cover',
  gap: 8,
  preview: true,
  emptyText: '--',
})

// 把单图和图集两种入参整理成统一的图片列表
const imageList = computed(() => {
  if (props.images.length) {
    return props.images.filter(Boolean)
  }

  return props.src ? [props.src] : []
})

// 两张及以上按图集模式展示，预览时可以直接前后切换
const isGroup = computed(() => imageList.value.length > 1)

// 单张和图集缩略图共用同一套边框和圆角
const containerStyle = computed(() => ({
  width: formatSize(props.width),
  height: formatSize(props.height),
  borderRadius: formatSize(props.radius),
}))

// 图集布局只关心间距，缩略图尺寸交给 a-image 自己处理
const groupStyle = computed(() => ({
  gap: `${props.gap}px`,
}))

// 加载失败时也保持和正常缩略图一致的尺寸
const placeholderStyle = computed(() => ({
  width: formatSize(props.width),
  height: formatSize(props.height),
  borderRadius: formatSize(props.radius),
}))

function formatSize(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}
</script>

<style scoped lang="scss">
.gi-image-preview__empty {
  color: var(--color-text-3);
}

.gi-image-preview__card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-border-2);
  background: var(--color-fill-2);
}

.gi-image-preview__card.is-previewable {
  cursor: pointer;
}

.gi-image-preview--single {
  display: block;
}

.gi-image-preview--group {
  display: flex;
  flex-wrap: wrap;
}

.gi-image-preview__item {
  display: block;
}

.gi-image-preview__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-3);
  font-size: 12px;
  background: var(--color-fill-2);
}

.gi-image-preview__mask {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  background: rgba(15, 23, 42, 0.42);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.gi-image-preview__mask-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(4px);
}

.gi-image-preview__mask-text {
  font-size: 12px;
  line-height: 1;
}

.gi-image-preview__card:hover .gi-image-preview__mask {
  opacity: 1;
}

.gi-image-preview--single:deep(.arco-image-img),
.gi-image-preview__item:deep(.arco-image-img) {
  display: block;
  transition: transform 0.25s ease;
}

.gi-image-preview__card:hover .gi-image-preview--single:deep(.arco-image-img),
.gi-image-preview__card:hover .gi-image-preview__item:deep(.arco-image-img) {
  transform: scale(1.06);
}
</style>
