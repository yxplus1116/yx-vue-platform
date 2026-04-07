<template>
  <a-drawer v-model:visible="visible" title="考点详情" :width="width >= 960 ? 960 : '100%'" :footer="false">
    <a-space direction="vertical" fill size="large">
      <a-card title="基本概览" :bordered="false">
        <a-descriptions :column="2" size="large" class="general-description">
          <a-descriptions-item label="考点名称">{{ dataDetail?.title || '--' }}</a-descriptions-item>
          <a-descriptions-item label="运营状态">
            <a-tag :color="Number(dataDetail?.status) === 1 ? 'green' : 'red'">
              {{ Number(dataDetail?.status) === 1 ? '启用' : '停用' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="推荐状态">
            <a-tag :color="Number(dataDetail?.isRecommended) === 1 ? 'arcoblue' : 'gray'">
              {{ Number(dataDetail?.isRecommended) === 1 ? '推荐' : '普通' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="考点类型">
            <GiCellTag :value="dataDetail?.venueType" :dict="venueType" />
          </a-descriptions-item>
          <a-descriptions-item label="应用场景">
            <GiCellTag :value="dataDetail?.scene" :dict="scene" />
          </a-descriptions-item>
          <a-descriptions-item label="考位区间">
            <GiCellTag :value="dataDetail?.seatBucket" :dict="seatCount" />
          </a-descriptions-item>
          <a-descriptions-item label="考场数量">{{ dataDetail?.roomCount || 0 }} 间</a-descriptions-item>
          <a-descriptions-item label="考位数量">{{ dataDetail?.seatCount || 0 }} 个</a-descriptions-item>
          <a-descriptions-item label="排序值">{{ dataDetail?.sort ?? '--' }}</a-descriptions-item>
          <a-descriptions-item label="标签">{{ dataDetail?.tags || '--' }}</a-descriptions-item>
          <a-descriptions-item label="首页摘要" :span="2">{{ dataDetail?.summary || '--' }}</a-descriptions-item>
          <a-descriptions-item label="详情介绍" :span="2">
            <div v-if="dataDetail?.description" class="venue-rich-text" v-html="dataDetail.description"></div>
            <span v-else>--</span>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <a-card title="位置与联系" :bordered="false">
        <a-descriptions :column="2" size="large" class="general-description">
          <a-descriptions-item label="考点 ID">{{ dataDetail?.id || '--' }}</a-descriptions-item>
          <a-descriptions-item label="省份">{{ dataDetail?.province || '--' }}</a-descriptions-item>
          <a-descriptions-item label="城市">{{ dataDetail?.city || '--' }}</a-descriptions-item>
          <a-descriptions-item label="列表短地址" :span="2">{{ dataDetail?.locationText || '--' }}</a-descriptions-item>
          <a-descriptions-item label="详细地址" :span="2">{{ dataDetail?.address || '--' }}</a-descriptions-item>
          <a-descriptions-item label="经度">{{ dataDetail?.longitude || '--' }}</a-descriptions-item>
          <a-descriptions-item label="纬度">{{ dataDetail?.latitude || '--' }}</a-descriptions-item>
          <a-descriptions-item label="联系电话">{{ dataDetail?.phone || '--' }}</a-descriptions-item>
          <a-descriptions-item label="联系邮箱">{{ dataDetail?.email || '--' }}</a-descriptions-item>
        </a-descriptions>
      </a-card>

      <a-card title="图片资源" :bordered="false">
        <a-descriptions :column="1" size="large" class="general-description">
          <a-descriptions-item label="封面图">
            <div v-if="resolvedCoverImage" class="venue-image">
              <img :src="resolvedCoverImage" :alt="dataDetail?.title" />
            </div>
            <span v-else>--</span>
          </a-descriptions-item>
          <a-descriptions-item label="图集">
            <div v-if="galleryImages.length" class="venue-gallery">
              <div v-for="image in galleryImages" :key="image" class="venue-gallery__item">
                <img :src="image" alt="考点图集" />
              </div>
            </div>
            <span v-else>--</span>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <a-card title="系统信息" :bordered="false">
        <a-descriptions :column="2" size="large" class="general-description">
          <a-descriptions-item label="创建人">{{ dataDetail?.createUserString || dataDetail?.createdBy || '--'
            }}</a-descriptions-item>
          <a-descriptions-item label="更新人">{{ dataDetail?.updateUserString || dataDetail?.updatedBy || '--'
            }}</a-descriptions-item>
          <a-descriptions-item label="创建时间">{{ dataDetail?.createTime || '--' }}</a-descriptions-item>
          <a-descriptions-item label="更新时间">{{ dataDetail?.updatedAt || '--' }}</a-descriptions-item>
          <!-- <a-descriptions-item label="删除时间" :span="2">{{ dataDetail?.deletedAt || '--' }}</a-descriptions-item> -->
        </a-descriptions>
      </a-card>
    </a-space>
  </a-drawer>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { type VenuesDetailResp, getVenues as getDetail } from '@/apis/business/venues'
import { useDict } from '@/hooks/app'
import { isHttp } from '@/utils/validate'

const { venueType, seatCount, scene } = useDict('venueType', 'seatCount', 'scene')

const { width } = useWindowSize()

const dataId = ref('')
const dataDetail = ref<VenuesDetailResp>()
const visible = ref(false)

/** 将图片地址统一转换为前端可访问的完整地址。 */
function resolveImageUrl(url?: string) {
  if (!url) {
    return ''
  }

  if (isHttp(url)) {
    return url
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
  if (!baseUrl) {
    return url
  }

  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

/** 当前封面图的展示地址。 */
const resolvedCoverImage = computed(() => resolveImageUrl(dataDetail.value?.coverImage))

/** 图集图片展示地址列表。 */
const galleryImages = computed(() => {
  if (!dataDetail.value?.gallery) {
    return []
  }

  return dataDetail.value.gallery
    .split(',')
    .map((item) => item.trim())
    .map((item) => resolveImageUrl(item))
    .filter(Boolean)
})

/** 查询详情。 */
const getDataDetail = async () => {
  const { data } = await getDetail(dataId.value)
  dataDetail.value = data
}

/** 打开抽屉并拉取详情。 */
const onOpen = async (id: string) => {
  dataId.value = id
  await getDataDetail()
  visible.value = true
}

defineExpose({ onOpen })
</script>

<style scoped lang="scss">
.venue-image {
  width: 160px;
  height: 100px;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid var(--color-border-2);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.venue-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
}

.venue-gallery__item {
  height: 80px;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid var(--color-border-2);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.venue-rich-text {
  line-height: 1.75;
  color: var(--color-text-2);
  word-break: break-word;
}

.venue-rich-text:deep(p) {
  margin: 0 0 12px;
}

.venue-rich-text:deep(p:last-child) {
  margin-bottom: 0;
}
</style>
