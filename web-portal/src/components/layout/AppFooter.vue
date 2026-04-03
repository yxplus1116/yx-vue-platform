<script setup lang="ts">
import { computed } from 'vue'
import { isAuthenticated } from '@/modules/auth'
import footerBg from '@/assets/image/footerBg.png'

const footerHeroStyle = {
  backgroundImage: `url(${footerBg})`,
}

// 已登录时 CTA 改为进入业务中心，避免继续跳去注册页后被守卫重定向。
const authed = computed(() => isAuthenticated())
</script>

<template>
  <footer class="footer">
    <section class="footer__hero" :style="footerHeroStyle">
      <div class="page-shell footer__hero-inner">
        <h2>全国考点平台 - 聚合考点资源, 助力高效对接</h2>
        <p>2 分钟发布您的考点, 马上对接全国需求, 快来注册吧</p>
        <a-button type="primary" class="footer__register" @click="$router.push(authed ? '/' : '/auth/register')">
          {{ authed ? '进入平台' : '立即注册' }}
        </a-button>
      </div>
    </section>

    <section class="footer__copyright">
      <div class="page-shell footer__copyright-inner">
        <span>&copy;2025 全国考点平台</span>
        <span>京ICP备17011335号</span>
        <RouterLink to="/solutions">关于我们</RouterLink>
      </div>
    </section>
  </footer>
</template>

<style scoped lang="less">
.footer {
  margin-top: auto;
  width: 100%;

  &__hero {
    height: 280px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  &__hero-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18px;
    height: 100%;
    text-align: center;

    h2 {
      margin: 0;
      color: #fff;
      font-size: 28px;
      font-weight: 700;
      line-height: 1.4;
    }

    p {
      margin: 0;
      color: rgba(255, 255, 255, 0.88);
      font-size: 16px;
      line-height: 1.5;
    }
  }

  &__register {
    width: 128px;
    height: 40px;
    margin-top: 6px;
    border-radius: 8px;
    font-size: 22px;
    font-weight: 600;
    color: #2c8cff;
    background: #fff;
    border-color: #fff;
    box-shadow: none;

    &:hover {
      color: #2c8cff;
      background: rgba(255, 255, 255, 0.94);
      border-color: rgba(255, 255, 255, 0.94);
    }
  }

  &__copyright {
    // height: 100px;padding
    padding: 16px 0;
    background: #ffffff;
  }

  &__copyright-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
    height: 100%;
    color: #555;
    font-size: 16px;

    a,
    span {
      position: relative;
    }

    >*+*::before {
      content: '|';
      position: absolute;
      left: -10px;
      color: #9ca3af;
    }
  }
}

@media (max-width: 768px) {
  .footer {
    &__hero {
      height: 280px;
    }

    &__hero-inner {
      gap: 14px;
      padding: 0 16px;

      h2 {
        font-size: 22px;
      }

      p {
        font-size: 14px;
      }
    }

    &__register {
      width: 132px;
      height: 46px;
      font-size: 22px;
    }

    &__copyright {
      height: auto;
      // min-height: 100px;
    }

    &__copyright-inner {
      flex-wrap: wrap;
      gap: 12px 18px;
      padding: 18px 16px;
      font-size: 14px;
    }
  }
}

@media (max-width: 480px) {
  .footer {
    &__hero {
      height: 240px;
    }

    &__hero-inner {
      h2 {
        font-size: 18px;
        line-height: 1.5;
      }

      p {
        font-size: 12px;
        line-height: 1.6;
      }
    }

    &__register {
      width: 116px;
      height: 40px;
      border-radius: 8px;
      font-size: 18px;
    }

    &__copyright-inner {
      gap: 8px 16px;
      padding: 0px 12px;
      font-size: 12px;
    }
  }
}
</style>
