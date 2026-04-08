<script setup lang="ts">
interface Props {
  // 卡片标题
  title: string

  // 标题下方的说明文案
  description: string

  // 底部补充说明，没有时可不传
  footerTip?: string
}

const props = defineProps<Props>()
</script>

<template>
  <a-card class="auth-card" :bordered="false">
    <template #title>
      <div class="auth-card__title">
        <div class="auth-card__title-copy">
          <h2>{{ props.title }}</h2>
          <p>{{ props.description }}</p>
        </div>
      </div>
    </template>

    <slot />

    <div v-if="props.footerTip || $slots.footer" class="auth-card__footer">
      <slot name="footer">
        <span>{{ props.footerTip }}</span>
      </slot>
    </div>
  </a-card>
</template>

<style scoped lang="less">
.auth-card {
  width: min(100%, 520px);
  border-radius: 18px;
  border: 1px solid rgba(15, 35, 95, 0.08);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(246, 250, 255, 0.94));
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.1);

  :deep(.arco-card-header) {
    height: auto;
    min-height: unset;
    align-items: flex-start;
  }
}

.auth-card__title-copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auth-card__title h2 {
  margin: 0;
  color: #102a43;
  font-size: 26px;
}

.auth-card__title p {
  margin: 0;
  color: #6b7c93;
  line-height: 1.7;
  font-size: 14px;
}

.auth-card__footer {
  margin-top: 4px;
  color: #97a6ba;
  font-size: 12px;
  line-height: 1.6;
}

@media (max-width: 480px) {
  .auth-card {
    width: 100%;
    border-radius: 14px;
  }

  .auth-card__title h2 {
    font-size: 22px;
  }

  .auth-card__title p {
    font-size: 13px;
  }
}
</style>
