import { test, expect, type Page } from "@playwright/test";

/**
 * 登录态预置：与 src/utils/auth.ts 的存储方式保持一致
 *   - sessionStorage.user-info：路由守卫读它判断是否已登录（storageSession）
 *   - cookie authorized-token：请求拦截/无感刷新读它
 *   - cookie multiple-tabs：多标签页免登录
 */
const BASE = "http://127.0.0.1:8848";
const USER_KEY = "user-info";

const session = {
  accessToken: "eyJhbGciOiJIUzUxMiJ9.admin",
  refreshToken: "eyJhbGciOiJIUzUxMiJ9.adminRefresh",
  expires: new Date("2030/10/30 00:00:00").getTime(),
  avatar: "",
  username: "admin",
  nickname: "小铭",
  roles: ["admin"]
};

/** 动态菜单接口返回的菜单树（component 必须指向 src/views 下真实存在的文件） */
const MENU_FIXTURE = [
  {
    path: "/system",
    meta: { icon: "ri:settings-3-line", title: "系统管理", rank: 2 },
    children: [
      {
        path: "/system/sysUser/index",
        component: "system/sysUser/index",
        name: "SysUser",
        meta: { icon: "ri:user-line", title: "用户管理", rank: 3 }
      }
    ]
  }
];

async function seedLogin(page: Page) {
  await page.context().addCookies([
    {
      name: "authorized-token",
      value: JSON.stringify({
        accessToken: session.accessToken,
        expires: session.expires,
        refreshToken: session.refreshToken
      }),
      url: BASE
    },
    { name: "multiple-tabs", value: "true", url: BASE }
  ]);

  await page.addInitScript(
    ([key, value]) => window.sessionStorage.setItem(key, value),
    [USER_KEY, JSON.stringify(session)]
  );

  // 真实 Java 后端不在 E2E 范围内：统一拦截 /api/**，
  // 只对菜单和用户信息返回真实形状的数据，其余给 success 空数据。
  // 否则任何一个 500 都会被全局 axios 拦截器判定为"需要重新登录"并踢回 /login。
  await page.route(url => new URL(url).pathname.startsWith("/api/"), route => {
    const path = new URL(route.request().url()).pathname;
    const ok = (data: unknown) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ code: 0, msg: "ok", data })
      });

    if (path === "/api/upms/sysMenu") return ok(MENU_FIXTURE);
    if (path === "/api/upms/sysUser/info") {
      return ok({
        id: 1,
        username: "admin",
        nickname: "小铭",
        avatar: "",
        roles: ["admin"],
        permissions: []
      });
    }
    if (path === "/api/upms/checkToken/isExpire") return ok(true);
    return ok(null);
  });
}

test.describe("未登录", () => {
  test("访问根路径被重定向到登录页", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));

    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator("canvas").first()).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("空表单提交触发前端校验，不发起登录请求", async ({ page }) => {
    let loginCalls = 0;
    page.on("request", req => {
      if (req.url().includes("/login") && req.method() === "POST") loginCalls += 1;
    });

    await page.goto("/login");
    await page.getByRole("button", { name: /登录/ }).first().click();

    await expect(page.locator(".el-form-item__error").first()).toBeVisible();
    expect(loginCalls).toBe(0);
  });

});

test.describe("已登录", () => {
  test.beforeEach(async ({ page }) => {
    await seedLogin(page);
  });

  test("进入首页后渲染布局、侧边栏与动态菜单", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));

    await page.goto("/");
    await expect(page).not.toHaveURL(/\/login/);

    await expect(page.locator(".app-main")).toBeVisible();
    await expect(page.locator(".sidebar-container, .el-menu").first()).toBeVisible();
    // 单子节点的目录会被拍平，菜单里直接出现叶子「用户管理」
    await expect(page.locator("text=用户管理").first()).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("点击菜单可以加载动态路由并切换页面", async ({ page }) => {
    await page.goto("/");
    const menuItem = page.locator("text=用户管理").first();
    await expect(menuItem).toBeVisible();

    await menuItem.click();

    await expect(page).toHaveURL(/\/system\/sysUser\/index/);
    await expect(page.locator(".app-main")).toBeVisible();
  });

  test("菜单接口 500 时提示服务器错误并退回登录页（不白屏）", async ({ page }) => {
    // 覆盖 beforeEach 里的成功 mock
    await page.unroute(url => new URL(url).pathname.startsWith("/api/"));
    await page.route(
      url => new URL(url).pathname.startsWith("/api/"),
      route => {
        const path = new URL(route.request().url()).pathname;
        if (path === "/api/upms/sysMenu") {
          return route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({ code: 500, msg: "menu service down", data: [] })
          });
        }
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ code: 0, msg: "ok", data: null })
        });
      }
    );

    await page.goto("/");

    // 全局响应拦截器对任意 500 都会 logOut()（非关键接口也一样），
    // 这是当前实现的行为，用用例固定住，避免以后改成"静默失败"却没人发现
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator(".el-message")).toContainText("服务器错误");
  });
});
