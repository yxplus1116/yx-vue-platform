<template>
  <footer class="footer">
    <div class="page-shell footer__inner">
      <div>
        <strong>PC Portal</strong>
        <p>统一门户前台骨架，承载首页、业务页、认证页与后续活动页面。</p>
      </div>

      <div class="footer__links">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/business">业务中心</RouterLink>
        <RouterLink to="/solutions">解决方案</RouterLink>
        <RouterLink to="/auth/login">登录</RouterLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  border-top: 1px solid rgba(15, 35, 95, 0.08);
  background: rgba(255, 255, 255, 0.68);
}

.footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 0;
}

.footer__inner strong {
  display: block;
  margin-bottom: 4px;
  color: #102a43;
  font-size: 14px;
}

.footer__inner p {
  margin: 0;
  color: #6b7c93;
  line-height: 1.6;
  font-size: 13px;
}

.footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  color: #486581;
  font-size: 13px;
}

@media (max-width: 768px) {
  .footer__inner {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px 0;
  }
}
</style>
