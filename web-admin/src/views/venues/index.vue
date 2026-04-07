<template>
  <GiPageLayout>
    <GiTable title="考点管理" row-key="id" :data="dataList" :columns="columns" :loading="loading"
      :scroll="{ x: '100%', y: '100%', minWidth: 1320 }" :pagination="pagination" :disabled-tools="['size']"
      :disabled-column-keys="['title']" @refresh="search">
      <template #toolbar-left>
        <a-input-search v-model="queryForm.title" placeholder="请输入考点名称" allow-clear style="width: 260px"
          @search="search" />
        <!-- <a-input v-model="queryForm.province" placeholder="请输入省份" allow-clear style="width: 160px" />
        <a-input v-model="queryForm.city" placeholder="请输入城市" allow-clear style="width: 160px" /> -->
        <a-select v-model="queryForm.seatBucket" :options="seatCount" placeholder="请选择考位区间" allow-clear
          style="width: 150px" @change="search" />
        <a-select v-model="queryForm.scene" :options="scene" placeholder="请选择应用场景" allow-clear style="width: 150px"
          @change="search" />
        <a-select v-model="queryForm.venueType" :options="venueType" placeholder="请选择考点类型" allow-clear
          style="width: 150px" @change="search" />
        <a-select v-model="queryForm.status" :options="booleans" placeholder="请选择状态:1启用 0停用" allow-clear
          style="width: 150px" @change="search" />
        <a-select v-model="queryForm.isRecommended" :options="booleans" placeholder="请选择是否推荐" allow-clear
          style="width: 150px" @change="search" />
        <a-button @click="reset">
          <template #icon><icon-refresh /></template>
          <template #default>重置</template>
        </a-button>
        <a-button type="primary" status="success" @click="search">
          <template #icon><icon-search /></template>
          <template #default>查询</template>
        </a-button>
      </template>
      <template #toolbar-right>
        <a-button v-permission="['business:venues:create']" type="primary" @click="onAdd">
          <template #icon><icon-plus /></template>
          <template #default>新增</template>
        </a-button>
        <a-button v-permission="['business:venues:export']" @click="onExport">
          <template #icon><icon-download /></template>
          <template #default>导出</template>
        </a-button>
      </template>
      <template #coverImage="{ record }">
        <div class="venue-cover">
          <img v-if="record.coverImage" :src="resolveImageUrl(record.coverImage)" :alt="record.title" />
          <span v-else>--</span>
        </div>
      </template>
      <template #status="{ record }">
        <a-tag :color="Number(record.status) === 1 ? 'green' : 'red'">
          {{ Number(record.status) === 1 ? '启用' : '停用' }}
        </a-tag>
      </template>
      <template #isRecommended="{ record }">
        <a-tag :color="Number(record.isRecommended) === 1 ? 'arcoblue' : 'gray'">
          {{ Number(record.isRecommended) === 1 ? '推荐' : '普通' }}
        </a-tag>
      </template>
      <template #venueType="{ record }">
        <GiCellTag :value="record.venueType" :dict="venueType" />
      </template>
      <template #scene="{ record }">
        <GiCellTag :value="record.scene" :dict="scene" />
      </template>
      <template #seatBucket="{ record }">
        <GiCellTag :value="record.seatBucket" :dict="seatCount" />
      </template>
      <template #action="{ record }">
        <a-space size="small">
          <a-link v-permission="['business:venues:get']" title="详情" @click="onDetail(record)">详情</a-link>
          <a-link v-permission="['business:venues:update']" title="修改" @click="onUpdate(record)">修改</a-link>
          <a-link v-permission="['business:venues:delete']" status="danger" :disabled="record.disabled"
            :title="record.disabled ? '不可删除' : '删除'" @click="onDelete(record)">
            删除
          </a-link>
        </a-space>
      </template>
    </GiTable>

    <AddModal ref="AddModalRef" @save-success="search" />
    <DetailDrawer ref="DetailDrawerRef" />
  </GiPageLayout>
</template>

<script setup lang="ts">
import type { TableInstance } from '@arco-design/web-vue'
import AddModal from './AddModal.vue'
import DetailDrawer from './DetailDrawer.vue'
import { type VenuesResp, type VenuesQuery, deleteVenues, exportVenues, listVenues } from '@/apis/business/venues'
import { useDownload, useTable } from '@/hooks'
import { useDict } from '@/hooks/app'
import { isMobile } from '@/utils'
import has from '@/utils/has'
import { isHttp } from '@/utils/validate'

defineOptions({ name: 'Venues' })

const { venueType, booleans, seatCount, scene } = useDict('venueType', 'booleans', 'seatCount', 'scene')

const queryForm = reactive<VenuesQuery>({
  title: undefined,
  province: undefined,
  city: undefined,
  seatBucket: undefined,
  scene: undefined,
  venueType: undefined,
  status: undefined,
  isRecommended: undefined,
  sort: ['id,desc']
})

const {
  tableData: dataList,
  loading,
  pagination,
  search,
  handleDelete
} = useTable((page) => listVenues({ ...queryForm, ...page }), { immediate: true })
const columns: TableInstance['columns'] = [
  // { title: '封面图', dataIndex: 'coverImage', slotName: 'coverImage', width: 110, align: 'center' },
  { title: '考点名称', dataIndex: 'title', width: 220, ellipsis: true, tooltip: true },
  { title: '省份', dataIndex: 'province', width: 120, ellipsis: true, tooltip: true },
  { title: '城市', dataIndex: 'city', width: 120, ellipsis: true, tooltip: true },
  { title: '考场数', dataIndex: 'roomCount', width: 100, align: 'center' },
  { title: '考位数', dataIndex: 'seatCount', width: 100, align: 'center' },
  { title: '考位区间', dataIndex: 'seatBucket', slotName: 'seatBucket', width: 120, align: 'center' },
  { title: '考点类型', dataIndex: 'venueType', slotName: 'venueType', width: 120, align: 'center' },
  { title: '应用场景', dataIndex: 'scene', slotName: 'scene', width: 120, align: 'center' },
  { title: '联系电话', dataIndex: 'phone', width: 140, ellipsis: true, tooltip: true },
  { title: '状态', dataIndex: 'status', slotName: 'status', width: 100, align: 'center' },
  { title: '推荐', dataIndex: 'isRecommended', slotName: 'isRecommended', width: 100, align: 'center' },
  { title: '创建时间', dataIndex: 'createTime', width: 180, align: 'center' },
  {
    title: '操作',
    dataIndex: 'action',
    slotName: 'action',
    width: 160,
    align: 'center',
    fixed: !isMobile() ? 'right' : undefined,
    show: has.hasPermOr(['business:venues:get', 'business:venues:update', 'business:venues:delete'])
  }
]

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

// 重置
const reset = () => {
  queryForm.title = undefined
  queryForm.province = undefined
  queryForm.city = undefined
  queryForm.seatBucket = undefined
  queryForm.scene = undefined
  queryForm.venueType = undefined
  queryForm.status = undefined
  queryForm.isRecommended = undefined
  search()
}

// 删除
const onDelete = (record: VenuesResp) => {
  return handleDelete(() => deleteVenues(record.id), {
    content: `是否确定删除该条数据？`,
    showModal: true
  })
}

// 导出
const onExport = () => {
  useDownload(() => exportVenues(queryForm))
}

const AddModalRef = ref<InstanceType<typeof AddModal>>()
// 新增
const onAdd = () => {
  AddModalRef.value?.onAdd()
}

// 修改
const onUpdate = (record: VenuesResp) => {
  AddModalRef.value?.onUpdate(record.id)
}

const DetailDrawerRef = ref<InstanceType<typeof DetailDrawer>>()
// 详情
const onDetail = (record: VenuesResp) => {
  DetailDrawerRef.value?.onOpen(record.id)
}
</script>

<style scoped lang="scss">
.venue-cover {
  display: inline-flex;
  width: 44px;
  height: 44px;
  overflow: hidden;
  border-radius: 6px;
  background: var(--color-fill-2);
  border: 1px solid var(--color-border-2);
  align-items: center;
  justify-content: center;
  color: var(--color-text-3);
  font-size: 12px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}
</style>
