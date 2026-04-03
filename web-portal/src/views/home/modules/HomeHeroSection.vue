<script setup lang="ts">
import homeBg from '@/assets/image/homeBg.png'
import searchIcon from '@/assets/image/searchIcon.png'

const heroStyle = {
  backgroundImage: `url(${homeBg})`,
}
</script>

<template>
  <section class="home-hero" :style="heroStyle">
    <div class="page-shell home-hero__inner">
      <div class="home-hero__content">
        <h1>全国考点平台</h1>
        <p>全国考点平台 - 聚合考点资源，助力高效对接</p>

        <div class="home-hero__search">
          <input type="text" placeholder="输入考点名称或关键词，进行搜索" />
          <button type="button" aria-label="搜索">
            <img :src="searchIcon" alt="" />
          </button>
        </div>
      </div>

      <div class="home-hero__categories">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.home-hero {
  position: relative;
  margin-top: -92px;
  padding-top: 92px;
  padding-bottom: 32px;
  background-position: center top;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #ffffff;

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100%;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 22px;
    width: 100%;
    padding: 44px 0 42px;
    text-align: center;

    h1 {
      margin: 0;
      color: #172033;
      font-size: 38px;
      font-weight: 700;
      line-height: 1.2;
    }

    p {
      margin: 0;
      color: #333b4f;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
  }

  &__search {
    display: flex;
    align-items: center;
    width: min(100%, 624px);
    height: 56px;
    padding: 0 12px 0 24px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);

    input {
      flex: 1;
      border: none;
      background: transparent;
      color: #334155;
      font-size: 14px;
      outline: none;

      &::placeholder {
        color: #94a3b8;
      }
    }

    button {
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: #3b82f6;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;

      img {
        display: block;
        width: 18px;
        height: 18px;
        object-fit: contain;
      }
    }
  }

  &__categories {
    width: 100%;
    margin-top: 10px;
  }
}

@media (max-width: 768px) {
  .home-hero {
    margin-top: -86px;
    padding-top: 86px;
    padding-bottom: 22px;

    &__inner {
      min-height: 100%;
    }

    &__content {
      gap: 18px;
      padding: 28px 0 28px;

      h1 {
        font-size: 30px;
      }

      p {
        font-size: 12px;
        line-height: 1.7;
      }
    }

    &__search {
      height: 48px;
      padding: 0 10px 0 16px;
    }

    &__categories {
      margin-top: 6px;
    }
  }
}

@media (max-width: 480px) {
  .home-hero {
    &__content {
      h1 {
        font-size: 26px;
      }
    }

    &__search {
      input {
        font-size: 13px;
      }
    }
  }
}
</style>
