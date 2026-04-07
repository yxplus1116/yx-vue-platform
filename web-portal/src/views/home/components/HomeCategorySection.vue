<script setup lang="ts">
import category1 from '../image/category1.png'
import category2 from '../image/categor2.png'
import category3 from '../image/categor3.png'
import type { HomeCategoryItem } from '../types'

defineProps<{
  items: HomeCategoryItem[]
}>()

const emit = defineEmits<{
  (e: 'select', value: string): void
}>()

const themeBackgroundMap = {
  business: category1,
  public: category2,
  private: category3,
}

function getCardStyle(theme?: HomeCategoryItem['theme']) {
  const resolvedTheme = theme || 'business'

  return {
    backgroundImage: `url(${themeBackgroundMap[resolvedTheme]})`,
  }
}
</script>

<template>
  <section class="home-category">
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      class="home-category__card"
      :class="[`is-${item.theme || 'business'}`, { 'is-active': item.active }]"
      :style="getCardStyle(item.theme)"
      @click="emit('select', item.value)"
    >
      <div class="home-category__copy">
        <h3>{{ item.label }}</h3>
        <p>{{ item.subtitle }}</p>
        <span class="home-category__action">{{ item.active ? '当前分类' : '查看该分类' }}</span>
      </div>
    </button>
  </section>
</template>

<style scoped lang="less">
.home-category {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  position: relative;
  z-index: 2;

  &__card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    min-height: 140px;
    padding: 16px 18px;
    border: 1px solid transparent;
    border-radius: 6px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    overflow: hidden;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      border-color 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px rgba(31, 58, 122, 0.08);
    }

    &.is-active {
      border-color: rgba(47, 116, 247, 0.35);
      box-shadow: 0 12px 24px rgba(47, 116, 247, 0.12);
    }
  }

  &__copy {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding-top: 2px;

    h3 {
      margin: 0;
      color: #2c7df7;
      font-size: 20px;
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: 0.2px;
    }

    p {
      margin: 0;
      color: #5f6f86;
      font-size: 12px;
      line-height: 1.5;
    }
  }

  &__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 88px;
    height: 28px;
    margin-top: 8px;
    padding: 0 14px;
    border-radius: 4px;
    color: #ffffff;
    background: linear-gradient(180deg, #4f8cff, #2f74f7);
    font-size: 12px;
    font-weight: 600;
  }
}

@media (max-width: 960px) {
  .home-category {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .home-category {
    &__card {
      min-height: 112px;
      padding: 14px 16px;
      background-position: right center;
    }

    &__copy {
      h3 {
        font-size: 18px;
      }
    }
  }
}
</style>
