<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getVenueDetail, type VenueImageTheme, type VenueItem } from '@/apis'
import VenueMap from '@/components/map/VenueMap.vue'
import collectIcon from '@/views/home/image/collect.png'
import emailIcon from '@/views/home/image/email.png'
import phoneIcon from '@/views/home/image/phone.png'
import shareIcon from '@/views/home/image/share.png'

// 详情页通过路由参数读取当前考点 id。
const route = useRoute()

// 将路由参数统一转换成 number，便于查找静态数据和后续接口入参。
const venueId = computed(() => Number(route.params.id))
// 当前详情页展示的考点数据。
const venue = ref<VenueItem | null>(null)
// 当前主图区域选中的图集主题。
const activeTheme = ref<VenueImageTheme>('building')
// 当前详情页加载状态。
const loading = ref(false)

/** 根据路由中的考点 ID 加载详情。 */
async function loadVenueDetail() {
  loading.value = true

  try {
    const response = await getVenueDetail(venueId.value)
    venue.value = response.success ? response.data : null
  } finally {
    loading.value = false
  }
}

// 当路由切换到新的考点时，默认展示该考点首张缩略图。
watch(
  venue,
  (nextVenue) => {
    activeTheme.value = nextVenue?.galleryThemes[0] || 'building'
  },
  { immediate: true },
)

/** 当路由中的考点 ID 变化时，重新加载详情。 */
watch(venueId, () => {
  loadVenueDetail()
})

/** 页面初始化时拉取考点详情。 */
onMounted(() => {
  loadVenueDetail()
})
</script>

<template>
  <a-spin v-if="loading" class="venue-detail__loading" :loading="loading" tip="考点信息加载中..." />

  <div v-else-if="venue" class="venue-detail page-shell">
    <section class="venue-detail__hero">
      <div class="venue-detail__hero-header">
        <div class="venue-detail__title-group">
          <h1>{{ venue.title }}</h1>
          <div class="venue-detail__tags">
            <span v-for="tag in venue.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>

        <div class="venue-detail__actions">
          <button type="button">
            <img :src="collectIcon" alt="" />
            <span>收藏</span>
          </button>
          <button type="button">
            <img :src="shareIcon" alt="" />
            <span>分享</span>
          </button>
        </div>
      </div>

      <div class="venue-detail__gallery">
        <div class="venue-detail__preview" :class="`is-${activeTheme}`">
          <div class="venue-detail__artwork"></div>
        </div>

        <div class="venue-detail__thumbs">
          <button v-for="theme in venue.galleryThemes" :key="theme" type="button" class="venue-detail__thumb"
            :class="[`is-${theme}`, { 'is-active': theme === activeTheme }]" @click="activeTheme = theme">
            <div class="venue-detail__thumb-artwork"></div>
          </button>
        </div>
      </div>
    </section>

    <section class="venue-detail__section">
      <h2>考点简介</h2>
      <div class="venue-detail__copy">
        <p v-for="paragraph in venue.description" :key="paragraph">
          {{ paragraph }}
        </p>
      </div>
    </section>

    <section class="venue-detail__section">
      <h2>考点规模</h2>
      <div class="venue-detail__metrics">
        <div class="venue-detail__metric">
          <span class="venue-detail__metric-label">考场数量</span>
          <span class="venue-detail__metric-value">{{ venue.roomCount }}</span>
          <em>间</em>
        </div>
        <div class="venue-detail__metric-divider"></div>
        <div class="venue-detail__metric">
          <span class="venue-detail__metric-label">考位数量</span>
          <span class="venue-detail__metric-value">{{ venue.seatCount }}</span>
          <em>个</em>
        </div>
      </div>
    </section>

    <section class="venue-detail__section">
      <h2>联系方式</h2>
      <div class="venue-detail__contacts">
        <article class="venue-detail__contact-card">
          <img class="venue-detail__contact-icon" :src="phoneIcon" alt="" />
          <div class="venue-detail__contact-content">
            <label>联系电话：</label>
            <span>{{ venue.phone }}</span>
          </div>
        </article>
        <article class="venue-detail__contact-card">
          <img class="venue-detail__contact-icon" :src="emailIcon" alt="" />
          <div class="venue-detail__contact-content">
            <label>联系邮箱：</label>
            <span>{{ venue.email }}</span>
          </div>
        </article>
      </div>
    </section>

    <section class="venue-detail__section">
      <h2>考点地址</h2>
      <VenueMap
        :longitude="venue.longitude"
        :latitude="venue.latitude"
        :address="venue.address"
      />
    </section>
  </div>

  <div v-else class="venue-detail__empty page-shell">
    <a-result status="404" title="未找到该考点" subtitle="当前考点信息不存在或已下线。" />
  </div>
</template>

<style scoped lang="less">
.venue-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 12px;

  &__hero {
    padding-top: 2px;
  }

  &__hero-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 12px;
  }

  &__title-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    h1 {
      margin: 0;
      color: #121826;
      font-size: 24px;
      line-height: 1.3;
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    span {
      padding: 2px 8px;
      border-radius: 4px;
      background: #4b7eff;
      color: #fff;
      font-size: 11px;
      line-height: 18px;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 18px;
    padding-top: 4px;

    button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 0;
      border: none;
      background: transparent;
      color: #5d677d;
      font-size: 13px;
      cursor: pointer;
    }

    img {
      width: 15px;
      height: 15px;
    }
  }

  &__gallery {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 86px;
    gap: 10px;
    align-items: stretch;
  }

  &__preview,
  &__thumb {
    position: relative;
    overflow: hidden;
    border: none;
    border-radius: 6px;
  }

  &__preview {
    height: 338px;
    background:
      radial-gradient(circle at 50% 12%, rgba(255, 255, 255, 0.52), rgba(255, 255, 255, 0) 42%),
      linear-gradient(180deg, #75b9ff 0%, #aedbff 58%, #ecd9b1 58%, #d7bf8c 100%);
  }

  &__thumbs {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__thumb {
    width: 86px;
    height: 78px;
    padding: 0;
    cursor: pointer;
    box-shadow: inset 0 0 0 1px rgba(215, 223, 238, 0.92);

    &.is-active {
      box-shadow:
        inset 0 0 0 2px #2b74ff,
        0 8px 18px rgba(43, 116, 255, 0.16);
    }
  }

  &__artwork,
  &__thumb-artwork {
    position: absolute;
    inset: auto 12% 0;
    height: 64%;
    border-radius: 8px 8px 2px 2px;
    background: linear-gradient(180deg, rgba(231, 204, 150, 0.98), rgba(183, 144, 88, 0.98));
    box-shadow: -18px 20px 36px rgba(43, 70, 131, 0.12);

    &::before {
      position: absolute;
      inset: 18% 12% auto;
      height: 26%;
      background: linear-gradient(180deg, rgba(37, 82, 196, 0.96), rgba(30, 62, 162, 0.98));
      content: '';
    }

    &::after {
      position: absolute;
      inset: auto 8% 0;
      height: 20%;
      background:
        repeating-linear-gradient(90deg,
          rgba(89, 140, 214, 0.96) 0,
          rgba(89, 140, 214, 0.96) 10%,
          rgba(227, 241, 255, 0.94) 10%,
          rgba(227, 241, 255, 0.94) 18%);
      content: '';
    }
  }

  &__thumb-artwork {
    inset: auto 12% 0;
    height: 58%;
    box-shadow: none;
  }

  &__preview.is-classroom,
  &__thumb.is-classroom {
    background:
      linear-gradient(180deg, rgba(245, 247, 252, 0.24), rgba(220, 226, 238, 0.44)),
      linear-gradient(180deg, #e7eef7 0%, #c9d4e2 100%);
  }

  &__preview.is-classroom &__artwork,
  &__thumb.is-classroom &__thumb-artwork {
    inset: auto 8% 10% 8%;
    height: 40%;
    border-radius: 8px;
    background: linear-gradient(180deg, rgba(244, 247, 252, 0.98), rgba(218, 225, 236, 0.98));

    &::before {
      inset: auto 9% 12% 9%;
      height: 34%;
      background:
        repeating-linear-gradient(0deg,
          rgba(142, 87, 34, 0.96) 0,
          rgba(142, 87, 34, 0.96) 15%,
          rgba(110, 67, 28, 0.98) 15%,
          rgba(110, 67, 28, 0.98) 28%,
          transparent 28%,
          transparent 40%),
        repeating-linear-gradient(90deg,
          rgba(105, 61, 25, 0.94) 0,
          rgba(105, 61, 25, 0.94) 12%,
          transparent 12%,
          transparent 18%);
    }

    &::after {
      inset: 10% 8% auto;
      height: 18%;
      background: linear-gradient(90deg, rgba(229, 234, 241, 0.96), rgba(250, 252, 255, 0.98));
    }
  }

  &__preview.is-campus,
  &__thumb.is-campus {
    background:
      radial-gradient(circle at 50% 14%, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0) 36%),
      linear-gradient(180deg, #69b1ff 0%, #96d0ff 40%, #ead8b0 40%, #d8c298 100%);
  }

  &__preview.is-campus &__artwork,
  &__thumb.is-campus &__thumb-artwork {
    inset: auto 10% 6% 10%;
    height: 48%;
    border-radius: 6px;
    background: linear-gradient(180deg, rgba(247, 235, 201, 0.98), rgba(220, 193, 135, 0.98));

    &::before {
      inset: 12% 10% auto;
      height: 28%;
      background:
        repeating-linear-gradient(90deg,
          rgba(78, 100, 144, 0.9) 0,
          rgba(78, 100, 144, 0.9) 10%,
          rgba(250, 252, 255, 0.96) 10%,
          rgba(250, 252, 255, 0.96) 18%);
    }
  }

  &__preview.is-hall,
  &__thumb.is-hall {
    background:
      linear-gradient(180deg, rgba(36, 43, 57, 0.12), rgba(16, 20, 31, 0.3)),
      linear-gradient(180deg, #393f4d 0%, #777d8a 100%);
  }

  &__preview.is-hall &__artwork,
  &__thumb.is-hall &__thumb-artwork {
    inset: auto 10% 10% 10%;
    height: 38%;
    border-radius: 6px;
    background: linear-gradient(180deg, rgba(248, 248, 248, 0.98), rgba(223, 223, 223, 0.98));

    &::before {
      inset: 18% 12% auto;
      height: 18%;
      background: linear-gradient(180deg, rgba(80, 85, 99, 0.94), rgba(43, 48, 59, 0.98));
    }

    &::after {
      inset: auto 6% 0;
      height: 18%;
      background:
        repeating-linear-gradient(90deg,
          rgba(186, 150, 105, 0.98) 0,
          rgba(186, 150, 105, 0.98) 12%,
          rgba(111, 83, 51, 0.98) 12%,
          rgba(111, 83, 51, 0.98) 20%);
    }
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 14px;

    h2 {
      position: relative;
      margin: 0;
      padding-left: 14px;
      color: #111827;
      font-size: 20px;
      line-height: 1.4;

      &::before {
        position: absolute;
        top: 50%;
        left: 0;
        width: 6px;
        height: 6px;
        border-radius: 1px;
        background: #2b74ff;
        transform: translateY(-50%);
        content: '';
      }
    }
  }

  &__copy {
    display: flex;
    flex-direction: column;
    gap: 12px;

    p {
      margin: 0;
      color: #404a5d;
      font-size: 14px;
      line-height: 1.9;
      text-align: justify;
    }
  }

  &__metrics {
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    align-items: center;
    min-height: 62px;
    padding: 0 26px;
    border-radius: 4px;
    background: linear-gradient(90deg, #3d7df6, #61a3ff);
    color: #fff;
  }

  &__metric {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 6px;

    &-label {
      font-size: 14px;
      opacity: 0.92;
    }

    &-value {
      font-size: 24px;
      font-weight: 700;
      line-height: 1;
      opacity: 1;
    }

    em {
      font-style: normal;
      font-size: 13px;
      opacity: 0.92;
    }
  }

  &__metric-divider {
    width: 1px;
    height: 28px;
    background: rgba(255, 255, 255, 0.28);
    justify-self: center;
  }

  &__contacts {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  &__contact-card {
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 62px;
    padding: 0 16px;
    border: 1px solid #e7edf7;
    border-radius: 8px;
    background: #fff;

    label {
      color: #5c6880;
      font-size: 13px;
    }
  }

  &__contact-icon {
    flex: 0 0 auto;
    width: 28px;
    height: 28px;
    object-fit: contain;
  }

  &__contact-content {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;

    label {
      flex: 0 0 auto;
      margin: 0;
      line-height: 1.4;
    }

    span {
      display: inline-block;
      min-width: 0;
      word-break: break-all;
      font-size: 22px;
      font-weight: 700;
      line-height: 1.2;
      color: #317af7;
    }
  }
  &__empty {
    padding-top: 48px;
    padding-bottom: 48px;
  }
}

.venue-detail__loading {
  display: flex;
  justify-content: center;
  padding: 80px 0 40px;
}

@media (max-width: 768px) {
  .venue-detail {
    gap: 20px;

    &__hero-header {
      flex-direction: column;
      align-items: flex-start;
    }

    &__actions {
      gap: 14px;
      padding-top: 0;
    }

    &__gallery {
      grid-template-columns: 1fr;
    }

    &__preview {
      height: 240px;
    }

    &__thumbs {
      flex-direction: row;
      overflow-x: auto;
    }

    &__thumb {
      flex: 0 0 auto;
    }

    &__metrics {
      grid-template-columns: 1fr;
      gap: 12px;
      padding: 18px;
    }

    &__metric-divider {
      display: none;
    }

    &__contacts {
      grid-template-columns: 1fr;
    }

    &__contact-content {
      span {
        font-size: 20px;
      }
    }
  }
}
</style>
