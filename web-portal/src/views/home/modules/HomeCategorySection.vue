<script setup lang="ts">
import category1 from '../image/category1.png'
import category2 from '../image/categor2.png'
import category3 from '../image/categor3.png'

interface CategoryItem {
  title: string
  subtitle: string
  description: string
  theme?: 'business' | 'public' | 'private'
}

defineProps<{
  items: CategoryItem[]
}>()

const themeBackgroundMap = {
  business: category1,
  public: category2,
  private: category3,
}

function getCardStyle(theme?: CategoryItem['theme']) {
  const resolvedTheme = theme || 'business'

  return {
    backgroundImage: `url(${themeBackgroundMap[resolvedTheme]})`,
  }
}
</script>

<template>
  <section class="home-category">
    <article v-for="item in items" :key="item.title" class="home-category__card"
      :class="`is-${item.theme || 'business'}`" :style="getCardStyle(item.theme)">
      <div class="home-category__copy">
        <h3>{{ item.title }}</h3>
        <p>{{ item.subtitle }}</p>
        <a-button type="primary" size="small">{{ item.description }}</a-button>
      </div>
    </article>
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
    border-radius: 6px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
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

    :deep(.arco-btn) {
      margin-top: 8px;
      min-width: 72px;
      height: 28px;
      padding: 0 14px;
      border-radius: 4px;
      border-color: #2f74f7;
      background: linear-gradient(180deg, #4f8cff, #2f74f7);
      font-size: 12px;
      font-weight: 600;
      box-shadow: none;
    }
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
