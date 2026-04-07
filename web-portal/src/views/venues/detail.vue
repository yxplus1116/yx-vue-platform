<script setup lang="ts">
import { onMounted } from 'vue'
import VenueMap from '@/components/map/VenueMap.vue'
import emailIcon from '@/assets/image/venue-email.png'
import phoneIcon from '@/assets/image/venue-phone.png'
import { useVenueDetail } from './hooks/useVenueDetail'

const {
  venue,
  activeImage,
  loading,
  authed,
  galleryImages,
  displayTags,
  longitude,
  latitude,
  contactTip,
  goLogin,
  initializeVenueDetailPage,
} = useVenueDetail()

onMounted(() => {
  void initializeVenueDetailPage()
})
</script>

<template>
  <a-spin v-if="loading" class="venue-detail__loading" :loading="loading" tip="考点信息加载中..." />

  <div v-else-if="venue" class="venue-detail page-shell">
    <section class="venue-detail__hero">
      <div class="venue-detail__hero-header">
        <div class="venue-detail__title-group">
          <h1>{{ venue.title }}</h1>
          <p class="venue-detail__location">{{ venue.locationText || venue.address || '--' }}</p>
          <div v-if="displayTags.length" class="venue-detail__tags">
            <span v-for="tag in displayTags" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <div v-if="galleryImages.length" class="venue-detail__gallery">
        <div class="venue-detail__preview">
          <img :src="activeImage" :alt="venue.title" />
        </div>

        <div class="venue-detail__thumbs">
          <button
            v-for="image in galleryImages"
            :key="image"
            type="button"
            class="venue-detail__thumb"
            :class="{ 'is-active': image === activeImage }"
            @click="activeImage = image"
          >
            <img :src="image" :alt="venue.title" />
          </button>
        </div>
      </div>

      <div v-else class="venue-detail__gallery-empty">当前考点暂未上传展示图片</div>
    </section>

    <section class="venue-detail__section">
      <h2>考点简介</h2>
      <div v-if="venue.description" class="venue-detail__rich-text" v-html="venue.description"></div>
      <div v-else class="venue-detail__plain-empty">暂无详细介绍</div>
    </section>

    <section class="venue-detail__section">
      <h2>考点规模</h2>
      <div class="venue-detail__metrics">
        <div class="venue-detail__metric">
          <span class="venue-detail__metric-label">考场数量</span>
          <span class="venue-detail__metric-value">{{ venue.roomCount || 0 }}</span>
          <em>间</em>
        </div>
        <div class="venue-detail__metric-divider"></div>
        <div class="venue-detail__metric">
          <span class="venue-detail__metric-label">考位数量</span>
          <span class="venue-detail__metric-value">{{ venue.seatCount || 0 }}</span>
          <em>个</em>
        </div>
      </div>
    </section>

    <section class="venue-detail__section">
      <h2>联系方式</h2>
      <p class="venue-detail__contact-tip">{{ contactTip }}</p>

      <div v-if="authed" class="venue-detail__contacts">
        <article class="venue-detail__contact-card">
          <img class="venue-detail__contact-icon" :src="phoneIcon" alt="" />
          <div class="venue-detail__contact-content">
            <label>联系电话</label>
            <span>{{ venue.phone || '--' }}</span>
          </div>
        </article>
        <article class="venue-detail__contact-card">
          <img class="venue-detail__contact-icon" :src="emailIcon" alt="" />
          <div class="venue-detail__contact-content">
            <label>联系邮箱</label>
            <span>{{ venue.email || '--' }}</span>
          </div>
        </article>
      </div>

      <div v-else class="venue-detail__login-card">
        <p>当前未登录，登录后可查看该考点完整联系电话与联系邮箱。</p>
        <a-button type="primary" @click="goLogin">立即登录</a-button>
      </div>
    </section>

    <section class="venue-detail__section">
      <h2>考点地址</h2>
      <p class="venue-detail__address-text">{{ venue.address || '--' }}</p>
      <VenueMap :longitude="longitude" :latitude="latitude" :address="venue.address" />
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
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__hero-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
  }

  &__title-group {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;

    h1 {
      margin: 0;
      color: #121826;
      font-size: 24px;
      line-height: 1.3;
    }
  }

  &__location {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
    line-height: 1.7;
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

  &__gallery {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 96px;
    gap: 12px;
  }

  &__preview {
    overflow: hidden;
    height: 360px;
    border-radius: 10px;
    background: #f3f6fb;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  &__thumbs {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__thumb {
    overflow: hidden;
    width: 96px;
    height: 82px;
    padding: 0;
    border: 1px solid rgba(203, 213, 225, 0.95);
    border-radius: 8px;
    background: #ffffff;
    cursor: pointer;

    &.is-active {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  &__gallery-empty,
  &__plain-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 160px;
    border-radius: 12px;
    background: #f8fafc;
    color: #64748b;
    font-size: 14px;
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 14px;

    h2 {
      margin: 0;
      color: #111827;
      font-size: 20px;
      font-weight: 700;
    }
  }

  &__rich-text {
    padding: 18px 20px;
    border-radius: 12px;
    background: #f8fafc;
    color: #334155;
    line-height: 1.8;
    word-break: break-word;

    :deep(p) {
      margin: 0 0 12px;
    }

    :deep(p:last-child) {
      margin-bottom: 0;
    }
  }

  &__metrics {
    display: flex;
    align-items: stretch;
    gap: 0;
    overflow: hidden;
    border-radius: 12px;
    background: linear-gradient(135deg, #eff6ff, #f8fbff);
    box-shadow: inset 0 0 0 1px rgba(191, 219, 254, 0.6);
  }

  &__metric {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 148px;

    em {
      color: #64748b;
      font-style: normal;
    }
  }

  &__metric-divider {
    width: 1px;
    background: rgba(148, 163, 184, 0.18);
  }

  &__metric-label {
    color: #64748b;
    font-size: 14px;
  }

  &__metric-value {
    color: #0f172a;
    font-size: 40px;
    font-weight: 700;
    line-height: 1;
  }

  &__contact-tip,
  &__address-text {
    margin: 0;
    color: #64748b;
    font-size: 14px;
    line-height: 1.8;
  }

  &__contacts {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  &__contact-card,
  &__login-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 20px;
    border-radius: 12px;
    background: #f8fafc;
    box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.85);
  }

  &__login-card {
    flex-direction: column;
    align-items: flex-start;

    p {
      margin: 0;
      color: #475569;
      line-height: 1.8;
    }
  }

  &__contact-icon {
    width: 26px;
    height: 26px;
    object-fit: contain;
    display: block;
  }

  &__contact-content {
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
      color: #64748b;
      font-size: 13px;
    }

    span {
      color: #0f172a;
      font-size: 16px;
      font-weight: 600;
    }
  }

  &__loading {
    min-height: 320px;
  }

  &__empty {
    padding-bottom: 40px;
  }
}

@media (max-width: 900px) {
  .venue-detail {
    &__gallery {
      grid-template-columns: 1fr;
    }

    &__preview {
      height: 280px;
    }

    &__thumbs {
      flex-direction: row;
      overflow-x: auto;
    }

    &__thumb {
      flex: 0 0 96px;
    }

    &__contacts {
      grid-template-columns: 1fr;
    }
  }
}

@media (max-width: 768px) {
  .venue-detail {
    gap: 20px;

    &__metrics {
      flex-direction: column;
    }

    &__metric-divider {
      width: 100%;
      height: 1px;
    }

    &__metric {
      min-height: 118px;
    }

    &__metric-value {
      font-size: 34px;
    }
  }
}
</style>
