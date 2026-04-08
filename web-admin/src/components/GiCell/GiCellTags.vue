<template>
  <a-overflow-list v-if="normalizedData.length">
    <a-tag
      v-for="(item, index) in normalizedData"
      :key="item.value ?? `${item.label}-${index}`"
      size="small"
      :color="getTagColor(item.extra)"
    >
      {{ item.label }}
    </a-tag>
    <template #overflow="{ number }">
      <a-popover :content-style="{ maxWidth: '300px', padding: '8px 12px' }">
        <a-tag color="arcoblue" size="small">+{{ number }}</a-tag>
        <template #content>
          <a-space wrap>
            <a-tag
              v-for="(tag, index) in normalizedData.filter((_, itemIndex) => itemIndex >= normalizedData.length - number)"
              :key="tag.value ?? `${tag.label}-${index}`"
              size="small"
              :color="getTagColor(tag.extra)"
            >
              {{ tag.label }}
            </a-tag>
          </a-space>
        </template>
      </a-popover>
    </template>
  </a-overflow-list>
</template>

<script setup lang="ts">
import type { GiCellTagsItemType } from '@/components/GiCell/type'

defineOptions({ name: 'GiCellTags' })

interface Props {
  // 标签数据，既支持纯文本，也支持带颜色信息的字典项
  data: Array<string | GiCellTagsItemType>
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
})

// 统一把外部传入的标签整理成同一份结构，方便模板渲染颜色和文案
const normalizedData = computed<GiCellTagsItemType[]>(() =>
  props.data.map((item) => {
    if (typeof item === 'string') {
      return { label: item }
    }

    return item
  }),
)

// 字典 extra 和 arco tag 颜色做一层映射，多标签和单标签保持一致
function getTagColor(extra?: string) {
  if (extra === 'primary') return 'arcoblue'
  if (extra === 'success') return 'green'
  if (extra === 'warning') return 'orangered'
  if (extra === 'error') return 'red'
  if (extra === 'default') return 'gray'
  return undefined
}
</script>

<style scoped lang="scss">
:deep(.arco-overflow-list-overflow) {
  display: flex;
}
</style>
