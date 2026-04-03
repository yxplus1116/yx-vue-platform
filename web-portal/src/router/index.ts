import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { isAuthenticated } from "@/modules/auth";

// 门户端按场景拆成两套路由容器：
// 业务与展示页走 PortalLayout，登录注册走 AuthLayout。
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layouts/PortalLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/home/index.vue"),
        meta: { title: "门户首页", navKey: "/" },
      },
      {
        path: "business",
        name: "business",
        component: () => import("@/views/business/index.vue"),
        meta: { title: "业务中心", navKey: "/business", requiresAuth: true },
      },
      {
        path: "solutions",
        name: "solutions",
        component: () => import("@/views/solutions/index.vue"),
        meta: { title: "解决方案", navKey: "/solutions" },
      },
      {
        path: "venues/:id",
        name: "venue-detail",
        component: () => import("@/views/venues/detail.vue"),
        meta: { title: "考点详情" },
      },
    ],
  },
  {
    path: "/auth",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("@/views/auth/login.vue"),
        meta: { title: "登录", publicOnly: true },
      },
      {
        path: "register",
        name: "register",
        component: () => import("@/views/auth/register.vue"),
        meta: { title: "注册", publicOnly: true },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/system/not-found.vue"),
    meta: { title: "页面不存在" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // 切换页面后统一回到顶部，避免门户长页面残留滚动位置。
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  const authed = isAuthenticated();

  // 受保护页面必须登录后进入，并保留原目标地址用于登录后回跳。
  if (to.meta.requiresAuth && !authed) {
    return {
      path: "/auth/login",
      query: {
        redirect: to.fullPath,
      },
    };
  }

  // 已登录用户不再停留在登录/注册页，直接回业务中心。
  if (to.meta.publicOnly && authed) {
    return { path: "/" };
  }

  return true;
});

router.afterEach((to) => {
  // 标题统一由路由元信息驱动，方便后续做站点级配置。
  document.title = `${to.meta.title || "门户端"} - PC Portal`;
});

export default router;
