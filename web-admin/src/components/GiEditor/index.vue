<template>
  <div ref="editorRef" class="gi-editor" :class="{ 'gi-editor--readonly': props.readonly }"></div>
</template>

<script setup lang="ts">
import { AiEditor, type AiEditorOptions } from 'aieditor'
import 'aieditor/dist/style.css'
import { useAppStore } from '@/stores'

defineOptions({ name: 'GiEditor' })

/** 富文本组件属性。 */
export interface GiEditorProps {
  /** 当前编辑器 HTML 内容。 */
  modelValue: string
  /** 输入为空时的占位提示。 */
  placeholder?: string
  /** 是否只读展示。 */
  readonly?: boolean
  /** 编辑区域最小高度。 */
  minHeight?: number
}

const props = withDefaults(defineProps<GiEditorProps>(), {
  modelValue: '',
  placeholder: '请输入内容',
  readonly: false,
  minHeight: 120,
})

const emit = defineEmits<{
  /** 同步最新 HTML 内容。 */
  (e: 'update:modelValue', value: string): void
}>()

const appStore = useAppStore()
const editorRef = ref<HTMLElement>()
const editorInstance = ref<AiEditor | null>(null)

/** 统一销毁当前编辑器实例。 */
function destroyEditor() {
  editorInstance.value?.destroy()
  editorInstance.value = null
}

/** 创建新的编辑器实例，并根据当前属性注入配置。 */
function createEditor() {
  if (!editorRef.value) {
    return
  }

  destroyEditor()

  const editorOptions: AiEditorOptions = {
    element: editorRef.value,
    theme: appStore.theme,
    placeholder: props.placeholder,
    content: props.modelValue || '',
    editable: !props.readonly,
    draggable: false,
    onChange: (editor: AiEditor) => {
      if (props.readonly) {
        return
      }
      emit('update:modelValue', editor.getHtml())
    },
  }

  editorInstance.value = new AiEditor(editorOptions)
}

watch(
  () => props.modelValue,
  (value) => {
    if (!editorInstance.value) {
      return
    }

    if (value !== editorInstance.value.getHtml()) {
      createEditor()
    }
  },
)

watch(
  () => props.readonly,
  () => {
    createEditor()
  },
)

watch(
  () => appStore.theme,
  () => {
    createEditor()
  },
)

onMounted(() => {
  createEditor()
})

onUnmounted(() => {
  destroyEditor()
})
</script>

<style scoped lang="scss">
.gi-editor {
  min-height: v-bind('`${props.minHeight}px`');
  border: 1px solid var(--color-border-2);
  border-radius: 6px;
  overflow: hidden;
}

.gi-editor:deep(.aie-container) {
  border: none !important;
}

.gi-editor:deep(.aie-main) {
  display: flex;
  flex: 1;
  padding: 0;
  background: var(--color-bg-1);
}

.gi-editor:deep(.aie-container-panel) {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  max-width: none;
  min-height: v-bind('`${props.minHeight}px`');
  margin: 0;
  padding: 12px;
  border: none;
  background: var(--color-bg-1);
  box-sizing: border-box;
}

.gi-editor:deep(.aie-container-main) {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.gi-editor:deep(.aie-content) {
  flex: 1;
  min-height: v-bind('`${Math.max(props.minHeight - 110, 160)}px`');
}

.gi-editor--readonly:deep(.aie-header-panel),
.gi-editor--readonly:deep(.aie-container-footer) {
  display: none;
}
</style>
