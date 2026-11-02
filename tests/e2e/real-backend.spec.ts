/**
 * 真实后端全链路 E2E：Vue 前端 ← Vite 代理 → 真实 zk-pure-boot（58088）→ MySQL(192.168.1.152) + Redis。
 *
 * 与 app.spec.ts 的区别：这里**不 mock 任何接口**，登录 token、菜单、用户列表全部来自真实后端。
 * 需要 Java 后端先启动（见根 AGENTS.md），因此默认跳过：
 *   pnpm e2e:real
 */
import { test, expect, type APIRequestContext } from "@playwright/test";
import { createCipheriv } from "node:crypto";

const USER = process.env.E2E_USER || "sysadmin";
const PASSWORD = process.env.E2E_PASSWORD || "Aa123456";
const API_BASE = process.env.E2E_JAVA_BASE || "http://127.0.0.1:58088";

/** 与前端 src/utils/aes.ts 一致：AES-128-CBC + ZeroPadding + IV=key，key 取 latin1 */
function encryptPassword(plain: string, keyStr = "Welcome Superred"): string {
  const key = Buffer.from(keyStr, "latin1");
  const data = Buffer.from(plain, "utf8");
  const padLen = 16 - (data.length % 16);
  const padded = Buffer.concat([data, Buffer.alloc(padLen === 16 ? 0 : padLen)]);

  const cipher = createCipheriv("aes-128-cbc", key, key);
  return Buffer.concat([cipher.update(padded), cipher.final()]).toString("base64");
}

/** 走真实 OAuth2 密码模式登录（PasswordDecordFilter 要求 password 为密文） */
async function loginViaApi(request: APIRequestContext) {
  const res = await request.post(`${API_BASE}/api/auth/oauth/token`, {
    headers: {
      Authorization: "Basic dGhfY2xpZW50OnRo", // th_client:th
      "Content-Type": "application/x-www-form-urlencoded"
    },
    form: {
      username: USER,
      password: encryptPassword(PASSWORD),
      grant_type: "password",
      scope: "select"
    }
  });

  expect(res.status(), await res.text()).toBe(200);
  return (await res.json()) as {
    access_token: string;
    refresh_token: string;
    expires: string;
    user_id: number;
    username: string;
    /** 后端下发的角色码（菜单 meta.roles 用它做过滤，必须原样种进 user-info） */
    roles?: string[];
  };
}

test.describe("真实后端（无 mock）", () => {
  test.skip(!process.env.E2E_REAL_BACKEND, "设置 E2E_REAL_BACKEND=1 且启动 Java 后端后运行");

  test("后端可达、未认证请求被 401 拦截", async ({ request }) => {
    const health = await request.get(`${API_BASE}/api/upms/sysMenu`);
    expect(health.status()).toBe(401);
  });

  test("真实登录后菜单与用户列表来自 MySQL", async ({ page, request, baseURL }) => {
    const auth = await loginViaApi(request);
    expect(auth.access_token).toBeTruthy();

    // 按前端 src/utils/auth.ts 的存储格式种入登录态
    const expires = new Date(auth.expires).getTime();
    await page.context().addCookies([
      {
        name: "authorized-token",
        value: JSON.stringify({
          accessToken: auth.access_token,
          expires,
          refreshToken: auth.refresh_token
        }),
        url: baseURL
      },
      { name: "multiple-tabs", value: "true", url: baseURL }
    ]);
    await page.addInitScript(
      ([key, value]) => window.sessionStorage.setItem(key, value),
      [
        "user-info",
        JSON.stringify({
          accessToken: auth.access_token,
          refreshToken: auth.refresh_token,
          expires,
          username: auth.username,
          nickname: auth.username,
          avatar: "",
          roles: auth.roles ?? [],
          user_id: auth.user_id
        })
      ]
    );

    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));

    await page.goto("/");
    await expect(page).not.toHaveURL(/\/login/);

    // 菜单来自 p_sys_menu（系统管理 /base → 用户管理、组织管理…）
    const menu = page.locator(".el-menu").first();
    await expect(menu).toContainText("系统管理");
    await expect(menu).toContainText("用户管理");

    // 直接进入用户管理：表格数据来自真实 /api/upms/sysUser/...
    await page.goto("/#/system/sysUser/index");
    await expect(page).toHaveURL(/\/system\/sysUser\/index/);

    const table = page.locator(".el-table").first();
    await expect(table).toBeVisible({ timeout: 20_000 });
    await expect(table).toContainText("sysadmin", { timeout: 20_000 });
    await expect(table).toContainText("系统管理员");

    expect(errors).toEqual([]);
  });
});
