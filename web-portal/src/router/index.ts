import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useAuthStoreWithOut } from "@/stores";

// 门户端按场景拆成两套路由容器
// 业务与展示页走 PortalLayout，登录注册走 AuthLayout
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layouts/PortalLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/home/index.vue"),
        meta: { title: "首页", navKey: "/" },
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

// 门户端全局路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // 切换页面后统一回到顶部，避免长页面残留滚动位置
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  // 路由守卫里不能直接用 setup store，这里走 withOut 版本
  const authStore = useAuthStoreWithOut();

  // 当前是否已登录
  const authed = authStore.isAuthenticated;

  // 受保护页面先登录，再按 redirect 回跳
  if (to.meta.requiresAuth && !authed) {
    return {
      path: "/auth/login",
      query: {
        redirect: to.fullPath,
      },
    };
  }

  // 已登录用户不再停留在登录页和注册页
  if (to.meta.publicOnly && authed) {
    return { path: "/" };
  }

  return true;
});

router.afterEach((to) => {
  // 标题统一由路由元信息驱动
  document.title = `${to.meta.title || "门户端"} - 考点平台`;
});

export default router;
