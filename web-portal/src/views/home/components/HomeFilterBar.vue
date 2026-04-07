<script setup lang="ts">
import { computed } from 'vue'
import { IconDown } from '@arco-design/web-vue/es/icon'
import type { HomeFilterGroup, HomeFilterKey, HomeFilterOption } from '../types'

const props = defineProps<{
  items: HomeFilterGroup[]
  modelValue: Record<HomeFilterKey, string>
}>()

const emit = defineEmits<{
  change: [payload: { key: HomeFilterKey, option: HomeFilterOption }]
}>()

const displayItems = computed(() =>
  props.items.map((item) => {
    const currentValue = props.modelValue[item.key] || ''
    const selectedOption = item.options.find((option) => option.value === currentValue)

    return {
      ...item,
      selectedValue: currentValue,
      displayLabel: selectedOption?.label || item.label,
      isActive: Boolean(currentValue),
    }
  }),
)

const handleSelect = (key: HomeFilterKey, option: HomeFilterOption) => {
  emit('change', { key, option })
}
</script>

<template>
  <section class="home-filter" aria-label="筛选条件">
    <a-dropdown v-for="item in displayItems" :key="item.key" position="bottom" class="home-filter__dropdown">
      <button type="button" class="home-filter__item" :class="{ 'is-active': item.isActive }">
        <span>{{ item.displayLabel }}</span>
        <IconDown class="home-filter__arrow" />
      </button>

      <template #content>
        <a-doption
          v-for="option in item.options"
          :key="`${item.key}-${option.value || option.label}`"
          :value="option.value"
          class="home-filter__menu-item"
          :class="{ 'is-selected': option.value === item.selectedValue }"
          @click="handleSelect(item.key, option)"
        >
          {{ option.label }}
        </a-doption>
      </template>
    </a-dropdown>
  </section>
</template>

<style scoped lang="less">
.home-filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 88px;
  padding: 0 4px;
  overflow-x: auto;

  &__dropdown {
    flex: 1 1 0;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    height: 50px;
    border: none;
    background: transparent;
    color: #31384a;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: #1f6bff;
    }

    &.is-active {
      color: #2a73ff;
      font-weight: 600;
    }
  }

  &__arrow {
    font-size: 13px;
    color: currentColor;
    transition: transform 0.2s ease;
  }

  &__menu-item {
    min-width: 152px;
    border-radius: 10px;
  }

  :deep(.arco-dropdown-list) {
    padding: 8px;
    border-radius: 14px;
    background: #ffffff;
    box-shadow: 0 12px 32px rgba(22, 39, 82, 0.1);
  }

  :deep(.arco-dropdown-option) {
    min-width: 152px;
    height: 38px;
    padding: 0 14px;
    border-radius: 10px;
    color: #3f4b63;
    font-size: 13px;
    line-height: 38px;

    &:hover {
      color: #2a73ff;
      background: rgba(42, 115, 255, 0.08);
    }
  }

  :deep(.arco-dropdown-option.is-selected) {
    color: #2a73ff;
    background: rgba(42, 115, 255, 0.08);
  }
}

@media (max-width: 768px) {
  .home-filter {
    justify-content: flex-start;
    gap: 6px;
    min-height: auto;
    padding: 6px 0 0;

    &__dropdown {
      flex: 0 0 auto;
    }

    &__item {
      justify-content: flex-start;
      min-width: 132px;
      height: 42px;
      padding: 0 10px;
      border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 4px 18px rgba(15, 23, 42, 0.06);
      font-size: 13px;
    }
  }
}
</style>
