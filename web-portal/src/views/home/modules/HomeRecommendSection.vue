<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { VenueItem } from '@/apis'
import collectIcon from '../image/collect.png'

const router = useRouter()

/** 推荐列表组件入参。 */
defineProps<{
  /** 当前页需要展示的考点列表。 */
  items: VenueItem[]
  /** 当前列表是否正在加载。 */
  loading?: boolean
}>()

/** 跳转到考点详情页。 */
const openVenueDetail = (id: number) => {
  router.push({
    name: 'venue-detail',
    params: { id },
  })
}
</script>

<template>
  <section class="home-recommend">
    <div class="home-recommend__head">
      <h2>优质考点推荐</h2>
    </div>

    <div class="home-recommend__grid">
      <template v-if="loading">
        <a-card v-for="index in 3" :key="index" class="home-recommend__skeleton-card" :bordered="false">
          <a-skeleton animation>
            <a-skeleton-line :rows="6" />
          </a-skeleton>
        </a-card>
      </template>

      <article
        v-else
        v-for="item in items"
        :key="item.id"
        class="home-recommend__card"
        role="link"
        tabindex="0"
        @click="openVenueDetail(item.id)"
        @keydown.enter="openVenueDetail(item.id)"
      >
        <div class="home-recommend__top">
          <div class="home-recommend__title-group">
            <h3>{{ item.title }}</h3>
            <p>{{ item.location }}</p>
          </div>
          <button
            type="button"
            class="home-recommend__fav"
            aria-label="收藏考点"
            @click.stop
          >
            <img :src="collectIcon" alt="" />
          </button>
        </div>

        <div class="home-recommend__tags">
          <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
        </div>

        <div class="home-recommend__image" :class="`is-${item.imageTheme}`" aria-hidden="true">
          <div class="home-recommend__image-building"></div>
        </div>

        <p class="home-recommend__desc">{{ item.summary }}</p>

        <div class="home-recommend__bottom">
          <span>考场数量: <strong>{{ item.roomCount }}</strong><em>间</em></span>
          <span>考位数量: <strong>{{ item.seatCount }}</strong><em>个</em></span>
        </div>
      </article>
    </div>

    <div class="home-recommend__pagination">
      <a-pagination :total="90" :page-size="9" :current="1" />
    </div>
  </section>
</template>

<style scoped lang="less">
.home-recommend {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 10px 0 0;

  &__head {
    text-align: center;

    h2 {
      margin: 0;
      color: #1f2937;
      font-size: 34px;
      font-weight: 700;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  &__skeleton-card {
    min-height: 280px;
    border-radius: 10px;
    background: #f6f9ff;
  }

  &__pagination {
    display: flex;
    justify-content: center;
    padding-top: 8px;

    :deep(.arco-pagination) {
      gap: 6px;
    }

    :deep(.arco-pagination-item),
    :deep(.arco-pagination-item-previous),
    :deep(.arco-pagination-item-next),
    :deep(.arco-pagination-item-jumper-pre),
    :deep(.arco-pagination-item-jumper-next) {
      min-width: 28px;
      height: 28px;
      line-height: 26px;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      background: #fff;
      color: #64748b;
    }

    :deep(.arco-pagination-item:hover),
    :deep(.arco-pagination-item-previous:hover),
    :deep(.arco-pagination-item-next:hover) {
      color: #2563eb;
      border-color: #bfdbfe;
    }

    :deep(.arco-pagination-item-active) {
      border-color: #3b82f6;
      background: #3b82f6;
      color: #fff;

      &:hover {
        border-color: #3b82f6;
        color: #fff;
      }
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px 20px 16px;
    border-radius: 10px;
    background: #f6f9ff;
    box-shadow: inset 0 0 0 1px rgba(220, 229, 244, 0.9);
    cursor: pointer;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow:
        inset 0 0 0 1px rgba(220, 229, 244, 0.9),
        0 12px 24px rgba(31, 58, 122, 0.08);
    }

    &:focus-visible {
      outline: 2px solid rgba(59, 130, 246, 0.45);
      outline-offset: 2px;
    }
  }

  &__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;

    h3 {
      margin: 0;
      color: #151c2f;
      font-size: 16px;
      font-weight: 700;
      line-height: 1.4;
    }
  }

  &__title-group {
    display: flex;
    flex-direction: column;
    gap: 4px;

    p {
      margin: 0;
      color: #6d778d;
      font-size: 12px;
      line-height: 1.4;
    }
  }

  &__fav {
    flex: 0 0 auto;
    width: 18px;
    height: 18px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;

    img {
      display: block;
      width: 18px;
      height: 18px;
      object-fit: contain;
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    span {
      padding: 2px 7px;
      border-radius: 4px;
      background: #4b7eff;
      color: #ffffff;
      font-size: 11px;
      line-height: 18px;
    }
  }

  &__image {
    position: relative;
    overflow: hidden;
    height: 172px;
    border-radius: 8px;
    background: linear-gradient(180deg, #d9ecff 0%, #8ab8ff 100%);

    &::after {
      position: absolute;
      inset: auto 0 0;
      height: 38%;
      background: linear-gradient(180deg, rgba(239, 246, 255, 0), rgba(230, 239, 255, 0.86));
      content: '';
    }

    &.is-classroom {
      background:
        linear-gradient(180deg, rgba(244, 249, 255, 0.06), rgba(232, 238, 248, 0.28)),
        linear-gradient(180deg, #dfeaf7 0%, #c0d0e8 100%);
    }

    &.is-campus {
      background:
        radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0) 38%),
        linear-gradient(180deg, #66adff 0%, #9cd0ff 42%, #ece0bd 42%, #d9c99d 100%);
    }

    &.is-building {
      background:
        radial-gradient(circle at 50% 16%, rgba(255, 255, 255, 0.62), rgba(255, 255, 255, 0) 44%),
        linear-gradient(180deg, #6eb6ff 0%, #8fd2ff 55%, #e7e3da 55%, #d7d0c6 100%);
    }
  }

  &__image-building {
    position: absolute;
    right: 18px;
    bottom: 18px;
    width: 72%;
    height: 70%;
    border-radius: 6px 6px 2px 2px;
    background: linear-gradient(180deg, rgba(254, 246, 227, 0.98), rgba(224, 200, 153, 0.98));
    box-shadow: -12px 10px 28px rgba(42, 72, 129, 0.12);

    &::before {
      position: absolute;
      inset: 16px 12px auto;
      height: 34%;
      background:
        repeating-linear-gradient(
          90deg,
          rgba(83, 108, 161, 0.78) 0,
          rgba(83, 108, 161, 0.78) 12%,
          rgba(245, 249, 255, 0.96) 12%,
          rgba(245, 249, 255, 0.96) 20%
        ),
        repeating-linear-gradient(
          180deg,
          transparent 0,
          transparent 44%,
          rgba(173, 145, 100, 0.46) 44%,
          rgba(173, 145, 100, 0.46) 52%
        );
      content: '';
    }

    &::after {
      position: absolute;
      inset: auto 8% 0;
      height: 22%;
      background: linear-gradient(180deg, rgba(207, 185, 142, 0.96), rgba(173, 145, 100, 0.96));
      content: '';
    }
  }

  &__image.is-classroom &__image-building {
    left: 10%;
    right: auto;
    bottom: 16%;
    width: 82%;
    height: 52%;
    border-radius: 8px;
    background:
      linear-gradient(180deg, rgba(246, 248, 252, 0.98), rgba(219, 227, 239, 0.98)),
      linear-gradient(90deg, transparent 0, transparent 100%);

    &::before {
      inset: auto 9% 14% 9%;
      height: 34%;
      background:
        repeating-linear-gradient(
          0deg,
          rgba(136, 87, 41, 0.94) 0,
          rgba(136, 87, 41, 0.94) 16%,
          rgba(109, 67, 32, 0.96) 16%,
          rgba(109, 67, 32, 0.96) 31%,
          transparent 31%,
          transparent 42%
        ),
        repeating-linear-gradient(
          90deg,
          rgba(95, 58, 29, 0.92) 0,
          rgba(95, 58, 29, 0.92) 14%,
          transparent 14%,
          transparent 20%
        );
    }

    &::after {
      inset: 10% 8% auto;
      height: 22%;
      background:
        linear-gradient(90deg, rgba(221, 229, 238, 0.94), rgba(246, 249, 255, 0.98)),
        linear-gradient(180deg, transparent, transparent);
    }
  }

  &__image.is-building &__image-building {
    width: 58%;
    height: 60%;
    border-radius: 8px 8px 4px 4px;
    background: linear-gradient(180deg, rgba(68, 109, 255, 0.98), rgba(35, 69, 185, 0.98));

    &::before {
      inset: 18% 10% auto;
      height: 22%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.04));
    }

    &::after {
      inset: auto 16% 0;
      height: 18%;
      background: linear-gradient(180deg, rgba(52, 82, 179, 0.98), rgba(31, 57, 143, 0.98));
    }
  }

  &__desc {
    margin: 0;
    color: #5f6778;
    font-size: 13px;
    line-height: 1.6;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding-top: 4px;
    color: #50586a;
    font-size: 13px;

    strong {
      margin: 0 4px 0 2px;
      color: #2b74ff;
      font-size: 18px;
      font-weight: 700;
    }

    em {
      color: #50586a;
      font-style: normal;
    }
  }
}

@media (max-width: 960px) {
  .home-recommend {
    &__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

@media (max-width: 768px) {
  .home-recommend {
    gap: 16px;

    &__head {
      h2 {
        font-size: 28px;
      }
    }

    &__grid {
      gap: 14px;
    }

    &__pagination {
      padding-top: 2px;
    }
  }
}

@media (max-width: 560px) {
  .home-recommend {
    &__grid {
      grid-template-columns: 1fr;
    }

    &__card {
      padding: 16px;
    }

    &__image {
      height: 148px;
    }

    &__bottom {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>
