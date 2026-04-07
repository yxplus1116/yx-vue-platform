<template>
  <a-upload
    :file-list="fileList"
    :list-type="props.listType ?? 'picture-card'"
    :limit="resolvedLimit"
    :multiple="props.multiple"
    :accept="props.accept ?? 'image/*'"
    :show-file-list="props.showFileList ?? true"
    :show-upload-button="resolvedShowUploadButton"
    :image-preview="props.imagePreview ?? true"
    :custom-request="handleUpload"
    :disabled="props.disabled"
    @change="handleChange"
  >
    <template v-if="$slots['upload-button']" #upload-button>
      <slot name="upload-button"></slot>
    </template>
  </a-upload>
</template>

<script setup lang="ts">
import { Message, type FileItem, type RequestOption } from '@arco-design/web-vue'
import { uploadFile } from '@/apis/system/file'
import { isHttp } from '@/utils/validate'

/** 图片上传组件值格式。 */
export type ImageUploadValueType = 'string' | 'array' | 'csv'

/** 图片上传组件属性。 */
export interface GiImageUploadProps {
  /** 当前表单值，支持单图字符串、多图数组或逗号分隔字符串。 */
  modelValue?: string | string[] | null
  /** 是否启用多图模式。 */
  multiple?: boolean
  /** 最多允许上传的图片数量。 */
  limit?: number
  /** 上传后输出值的格式。 */
  valueType?: ImageUploadValueType
  /** 上传到文件中心时使用的表单字段名。 */
  uploadName?: string
  /** 上传到文件中心时的父级目录。 */
  parentPath?: string
  /** 图片类型限制。 */
  accept?: string
  /** 上传列表展示样式。 */
  listType?: 'text' | 'picture' | 'picture-card'
  /** 是否显示文件列表。 */
  showFileList?: boolean
  /** 是否启用图片预览。 */
  imagePreview?: boolean
  /** 是否禁用上传。 */
  disabled?: boolean
  /** 自定义响应 URL 提取逻辑。 */
  responseUrlResolver?: (response: any) => string
}

/** 带有原始地址的上传文件项。 */
interface ImageFileItem extends FileItem {
  /** 后端实际返回的原始文件地址，用于提交表单时保持值不变。 */
  rawUrl?: string
}

const props = withDefaults(defineProps<GiImageUploadProps>(), {
  modelValue: '',
  multiple: false,
  limit: 1,
  valueType: 'string',
  uploadName: 'file',
  parentPath: '/',
  accept: 'image/*',
  listType: 'picture-card',
  showFileList: true,
  imagePreview: true,
  disabled: false,
})

const emit = defineEmits<{
  /** 更新组件双向绑定值。 */
  (e: 'update:modelValue', value: string | string[]): void
  /** 上传值变化时抛出标准化后的结果。 */
  (e: 'change', value: string | string[], fileList: FileItem[]): void
}>()

/** 当前上传列表。 */
const fileList = ref<FileItem[]>([])

/** 统一计算数量限制。 */
const resolvedLimit = computed(() => props.multiple ? props.limit : 1)

/** 控制上传按钮是否继续显示。 */
const resolvedShowUploadButton = computed(() => {
  if (!props.showFileList) {
    return true
  }
  return fileList.value.length < resolvedLimit.value
})

/** 将任意输入值转换为 URL 数组。 */
function normalizeUrls(value: string | string[] | null | undefined) {
  if (Array.isArray(value)) {
    return value.filter(Boolean)
  }

  if (typeof value === 'string') {
    if (!value.trim()) {
      return []
    }

    if (props.multiple || props.valueType === 'csv') {
      return value.split(',').map((item) => item.trim()).filter(Boolean)
    }

    return [value]
  }

  return []
}

/** 将相对路径图片地址补全为可展示的完整地址。 */
function resolveDisplayUrl(url: string) {
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

/** 从 URL 中推导文件名，方便回显。 */
function getFileNameFromUrl(url: string) {
  try {
    const pathname = new URL(url, window.location.origin).pathname
    return pathname.split('/').pop() || 'image'
  } catch {
    return url.split('/').pop() || 'image'
  }
}

/** 将 URL 数组转换为 arco upload 需要的 fileList。 */
function buildFileList(urls: string[]) {
  return urls.map((url, index) => ({
    uid: `history-${index}-${url}`,
    name: getFileNameFromUrl(url),
    url: resolveDisplayUrl(url),
    rawUrl: url,
    status: 'done',
  } as ImageFileItem))
}

/** 将 fileList 转换回表单值。 */
function formatValue(nextFileList: FileItem[]) {
  const urls = nextFileList
    .map((item) => (item as ImageFileItem).rawUrl || item.url || '')
    .filter(Boolean)

  if (props.multiple) {
    if (props.valueType === 'csv') {
      return urls.join(',')
    }
    return urls
  }

  return urls[0] || ''
}

/** 从上传响应中提取最终图片地址。 */
function resolveResponseUrl(response: any) {
  if (props.responseUrlResolver) {
    return props.responseUrlResolver(response)
  }

  return response?.data?.url || response?.data?.thumbnailUrl || response?.url || ''
}

/** 同步外部传入值到内部 fileList。 */
watch(
  () => props.modelValue,
  (value) => {
    const urls = normalizeUrls(value)
    const nextFileList = buildFileList(urls)
    const currentSignature = fileList.value.map((item) => item.url).join(',')
    const nextSignature = nextFileList.map((item) => item.url).join(',')

    if (currentSignature !== nextSignature) {
      fileList.value = nextFileList
    }
  },
  { immediate: true },
)

/** 处理上传过程并写回 URL。 */
const handleUpload = (options: RequestOption) => {
  const controller = new AbortController()

  ;(async function requestWrap() {
    const { onProgress, onError, onSuccess, fileItem, name = props.uploadName } = options

    onProgress(20)
    const formData = new FormData()
    formData.append('parentPath', props.parentPath)
    formData.append(name as string, fileItem.file as Blob)

    try {
      const response = await uploadFile(formData)
      const url = resolveResponseUrl(response)

      if (!url) {
        throw new Error('未获取到图片地址')
      }

      ;(fileItem as ImageFileItem).rawUrl = url
      fileItem.url = resolveDisplayUrl(url)
      fileItem.status = 'done'
      Message.success('上传成功')
      onSuccess(response)
    } catch (error) {
      onError(error)
      Message.error('上传失败')
    }
  })()

  return {
    /** 终止上传请求。 */
    abort() {
      controller.abort()
    },
  }
}

/** 从 Upload change 事件参数中提取标准 fileList。 */
function resolveChangedFileList(args: unknown[]) {
  const arrayArg = args.find((item) => Array.isArray(item))
  if (Array.isArray(arrayArg)) {
    return arrayArg as FileItem[]
  }

  const objectArg = args.find((item) => item && typeof item === 'object' && Array.isArray((item as any).fileList))
  if (objectArg && typeof objectArg === 'object') {
    return (objectArg as { fileList: FileItem[] }).fileList
  }

  return []
}

/** 处理 fileList 变化，并同步为业务值。 */
function handleChange(...args: unknown[]) {
  const nextFileList = resolveChangedFileList(args)
  fileList.value = nextFileList
  const value = formatValue(nextFileList)
  emit('update:modelValue', value)
  emit('change', value, nextFileList)
}
</script>
