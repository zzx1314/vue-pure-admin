import { test, expect, type Page } from "@playwright/test";

/**
 * 授权设备「去激活」交互。
 *
 * 与 app.spec.ts 相同：不依赖真实 Java 后端，用 sessionStorage + cookie 预置登录态，
 * 拦截 /api/** 返回真实形状的数据，只验证前端交互与请求参数。
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

/** 动态菜单：指向 src/views/otacertifi/device/index.vue */
const MENU_FIXTURE = [
  {
    path: "/otacertifi",
    meta: { icon: "ri:settings-3-line", title: "证书授权", rank: 2 },
    children: [
      {
        path: "/otacertifi/device/index",
        component: "otacertifi/device/index",
        name: "LicenseBusDevice",
        meta: { icon: "ri:user-line", title: "授权设备", rank: 3 }
      }
    ]
  }
];

/** 一台已激活 + 一台待激活设备 */
const DEVICES = [
  {
    id: 1,
    activationCode: "AC-ACTIVATED",
    projName: "演示项目",
    projCode: "PROJ-1",
    username: "customer",
    userId: 2,
    cerStatus: "已激活",
    productName: "网关",
    sn: "SN-ACTIVATED-001",
    osVersion: "1.0.0",
    processArch: "arm64",
    cerFailureTime: "2025-01-01 10:00:00,2026-01-01 10:00:00",
    commTime: "2025-06-01 08:00:00",
    activationTime: "2025-01-01 10:00:00"
  },
  {
    id: 2,
    activationCode: "AC-PENDING",
    projName: "演示项目",
    projCode: "PROJ-1",
    username: "customer",
    userId: 2,
    cerStatus: "待激活",
    productName: "网关",
    sn: null,
    osVersion: "1.0.0",
    processArch: "arm64",
    cerFailureTime: "",
    commTime: "2025-06-01 08:00:00",
    activationTime: null
  }
];

const ok = (data: unknown) => ({
  status: 200,
  contentType: "application/json",
  body: JSON.stringify({ code: 10200, msg: "ok", data })
});

async function seedLogin(page: Page, onDeactivate: (url: string) => void) {
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

  await page.route(
    url => new URL(url).pathname.startsWith("/api/"),
    route => {
      const path = new URL(route.request().url()).pathname;
      if (path === "/api/upms/sysMenu") return route.fulfill(ok(MENU_FIXTURE));
      if (path === "/api/upms/sysUser/info") {
        return route.fulfill(
          ok({
            id: 1,
            username: "admin",
            nickname: "小铭",
            avatar: "",
            roles: ["admin"],
            permissions: []
          })
        );
      }
      if (path === "/api/upms/checkToken/isExpire")
        return route.fulfill(ok(true));
      if (path === "/api/license/licenseBusDevice/page") {
        return route.fulfill(
          ok({ records: DEVICES, total: DEVICES.length, size: 10, current: 1 })
        );
      }
      if (path.startsWith("/api/license/licenseBusDevice/deactivate/")) {
        onDeactivate(route.request().url());
        return route.fulfill(ok(null));
      }
      return route.fulfill(ok(null));
    }
  );
}

test.describe("授权设备去激活", () => {
  test("只有可去激活的设备能点，确认后调用 deactivate 接口", async ({
    page
  }) => {
    const deactivateCalls: string[] = [];
    await seedLogin(page, url => deactivateCalls.push(url));

    // 应用是 hash 路由，动态路由由菜单接口注册：先回首页再点菜单进入，不要在深链上直接 goto
    await page.goto("/");
    await page.locator("text=授权设备").first().click();
    await expect(page.locator(".app-main")).toBeVisible();
    await expect(page).toHaveURL(/otacertifi/);

    const activatedRow = page.locator("tr", { hasText: "AC-ACTIVATED" });
    const pendingRow = page.locator("tr", { hasText: "AC-PENDING" });
    await expect(activatedRow).toBeVisible();
    await expect(pendingRow).toBeVisible();

    // 客户端上报的 sn 必须在列表里能看到（老客户端不传时该列为空）
    await expect(
      page.locator("th", { hasText: "设备序列号" }).first()
    ).toBeVisible();
    await expect(activatedRow).toContainText("SN-ACTIVATED-001");

    // 「待激活」设备从未占用授权点数，按钮必须是禁用的
    const pendingButton = pendingRow.getByRole("button", { name: "去激活" });
    await expect(pendingButton).toBeDisabled();

    const activatedButton = activatedRow.getByRole("button", {
      name: "去激活"
    });
    await expect(activatedButton).toBeEnabled();

    // 二次确认：文案里要点明「释放授权点数」与「授权时间按第一次起算」
    await activatedButton.click();
    const dialog = page.locator(".el-message-box");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("AC-ACTIVATED");
    await expect(dialog).toContainText("释放一个授权点数");

    // 取消不发请求
    await dialog.getByRole("button", { name: "取消" }).click();
    await expect(dialog).toBeHidden();
    expect(deactivateCalls).toEqual([]);

    // 确认后按设备 id 调用
    await activatedButton.click();
    await page
      .locator(".el-message-box")
      .getByRole("button", { name: "确定去激活" })
      .click();

    await expect
      .poll(() => deactivateCalls.length, { timeout: 10_000 })
      .toBe(1);
    expect(deactivateCalls[0]).toContain(
      "/api/license/licenseBusDevice/deactivate/1"
    );
    await expect(page.locator(".el-message").first()).toContainText(
      "去激活成功"
    );
  });
});
