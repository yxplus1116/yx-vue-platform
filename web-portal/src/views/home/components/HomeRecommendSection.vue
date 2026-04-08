<script setup lang="ts">
import { useRouter } from 'vue-router'
import { resolveVenueAssetUrl } from '@/business/venues'
import type { HomeVenueCardItem } from '../types'

const router = useRouter()

const props = withDefaults(defineProps<{
  items: HomeVenueCardItem[]
  loading?: boolean
  current: number
  pageSize: number
  total: number
}>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

// 详情页改成新窗口打开，用户看完还能保留当前首页筛选和滚动位置
const openVenueDetail = (id: string) => {
  const detailRoute = router.resolve({
    name: 'venue-detail',
    params: { id },
  })

  window.open(detailRoute.href, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <section class="home-recommend">
    <div class="home-recommend__head">
      <h2>优质考点推荐</h2>
    </div>

    <div class="home-recommend__grid">
      <template v-if="props.loading">
        <a-card v-for="index in 3" :key="index" class="home-recommend__skeleton-card" :bordered="false">
          <a-skeleton animation>
            <a-skeleton-line :rows="6" />
          </a-skeleton>
        </a-card>
      </template>

      <a-empty v-else-if="!props.items.length" class="home-recommend__empty" description="当前筛选条件下暂无考点" />

      <article v-else v-for="item in props.items" :key="item.id" class="home-recommend__card" role="link" tabindex="0"
        @click="openVenueDetail(item.id)" @keydown.enter="openVenueDetail(item.id)">
        <div class="home-recommend__top">
          <div class="home-recommend__title-group">
            <div class="home-recommend__title-line">
              <h3>{{ item.title }}</h3>
              <span v-if="Number(item.recommended) === 1" class="home-recommend__badge">推荐</span>
            </div>
            <p>{{ item.locationText || item.address || '--' }}</p>
          </div>
        </div>

        <div v-if="item.displayTags.length" class="home-recommend__tags">
          <span v-for="tag in item.displayTags" :key="tag">{{ tag }}</span>
        </div>

        <div class="home-recommend__image" aria-hidden="true">
          <img v-if="item.coverImage" :src="resolveVenueAssetUrl(item.coverImage)" :alt="item.title" />
          <div v-else class="home-recommend__image-empty">暂无封面</div>
        </div>

        <p class="home-recommend__desc">{{ item.summary || '暂无摘要介绍' }}</p>

        <div class="home-recommend__bottom">
          <span>考场数量: <strong>{{ item.roomCount || 0 }}</strong><em>间</em></span>
          <span>考位数量: <strong>{{ item.seatCount || 0 }}</strong><em>个</em></span>
        </div>
      </article>
    </div>

    <div v-if="props.total > props.pageSize" class="home-recommend__pagination">
      <a-pagination :total="props.total" :page-size="props.pageSize" :current="props.current"
        @change="emit('page-change', $event)" />
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

  &__empty {
    grid-column: 1 / -1;
    padding: 56px 0;
    border-radius: 16px;
    background: #f6f9ff;
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
    gap: 12px;
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
  }

  &__title-group {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 4px;

    p {
      margin: 0;
      color: #6d778d;
      font-size: 12px;
      line-height: 1.4;
    }
  }

  &__title-line {
    display: flex;
    align-items: center;
    gap: 8px;

    h3 {
      margin: 0;
      color: #151c2f;
      font-size: 16px;
      font-weight: 700;
      line-height: 1.4;
    }
  }

  &__badge {
    padding: 2px 7px;
    border-radius: 999px;
    background: rgba(37, 99, 235, 0.12);
    color: #2563eb;
    font-size: 11px;
    line-height: 18px;
    white-space: nowrap;
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
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    height: 172px;
    border-radius: 8px;
    background: linear-gradient(180deg, #d9ecff 0%, #8ab8ff 100%);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  &__image-empty {
    color: rgba(255, 255, 255, 0.88);
    font-size: 14px;
    font-weight: 600;
  }

  &__desc {
    margin: 0;
    color: #4b5563;
    font-size: 13px;
    line-height: 1.75;
    word-break: break-word;
    margin-bottom: auto;
  }

  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 2px;
    color: #475569;
    font-size: 13px;

    strong {
      margin-left: 4px;
      color: #317AF7;
      font-size: 18px;
    }

    em {
      margin-left: 2px;
      font-style: normal;
    }
  }
}

@media (max-width: 1024px) {
  .home-recommend {
    &__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

@media (max-width: 768px) {
  .home-recommend {
    gap: 18px;

    &__head {
      h2 {
        font-size: 26px;
      }
    }

    &__grid {
      grid-template-columns: 1fr;
      gap: 14px;
    }

    &__bottom {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>
