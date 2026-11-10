import { test, expect, type Page, type Route } from "@playwright/test";

/**
 * 流程审批弹窗。
 *
 * 回归点：
 *   1. 业务快照里的特性是逗号串 `featuresId`，审批弹窗绑的是 `featuresIdArray`，
 *      字段名/类型对不上会导致「特性名称」一格空白 —— 这里断言能回显出特性名称。
 *   2. 审批意见、审批状态必填：空着点提交不能发请求，并给出字段级报错。
 *
 * 与其它 e2e 一样不依赖真实 Java 后端，拦截 /api/** 返回真实形状的数据。
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

/** 动态菜单：指向 src/views/system/sysActiviti/index.vue */
const MENU_FIXTURE = [
  {
    path: "/system",
    meta: { icon: "ri:settings-3-line", title: "系统管理", rank: 2 },
    children: [
      {
        path: "/system/sysActiviti/index",
        component: "system/sysActiviti/index",
        name: "ActThTask",
        meta: { icon: "ri:flow-chart", title: "流程审批", rank: 3 }
      }
    ]
  }
];

/** 特性下拉：value 是数字 id（与后端 SelectOption 一致） */
const FEATURES = [
  { value: 1, label: "标准特性" },
  { value: 2, label: "高级特性" },
  { value: 3, label: "其它特性" }
];

/** 待审批任务：业务快照里特性存的是逗号串 featuresId */
const TASKS = [
  {
    id: 11,
    businessId: 7,
    businessName: "演示项目",
    businessType: "授权项目变更",
    processInstanceId: 1001,
    applyPerName: "customer",
    createTime: "2025-01-01 10:00:00",
    taskState: "进行中",
    businessServiceChange: JSON.stringify({
      changeService: "licenseBusProjService",
      filed: {
        id: 7,
        projName: "演示项目",
        projCode: "PROJ-1",
        customerId: 2,
        featuresId: "1,2",
        liceNum: "10",
        liceTime: "365",
        remark: "扩容"
      }
    })
  }
];

const ok = (route: Route, data: unknown) =>
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ code: 10200, msg: "ok", data })
  });

async function seedLogin(page: Page, onApproval: (body: any) => void) {
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
      if (path === "/api/upms/sysMenu") return ok(route, MENU_FIXTURE);
      if (path === "/api/upms/sysUser/info") {
        return ok(route, {
          id: 1,
          username: "admin",
          nickname: "小铭",
          avatar: "",
          roles: ["admin"],
          permissions: []
        });
      }
      if (path === "/api/upms/checkToken/isExpire") return ok(route, true);
      if (path === "/api/upms/activity/getMyTaskPage") {
        return ok(route, {
          records: TASKS,
          total: TASKS.length,
          size: 10,
          current: 1
        });
      }
      if (path.startsWith("/api/upms/activity/getNextNode/")) {
        return ok(route, {
          currentFlowNodeId: "node-2",
          beforeFlowNodeId: "node-1",
          nodeType: "UserTask",
          processId: 3,
          useInfo: [{ label: "审批人甲", value: 12 }]
        });
      }
      if (path.startsWith("/api/upms/activity/getHistoryApprovalOpinion/")) {
        return ok(route, [
          {
            operator: "customer",
            createTime: "2025-01-01 10:00:00",
            operatorStep: 1,
            remark: "申请扩容"
          }
        ]);
      }
      if (path === "/api/cer/cerBusProd/getFeaturesSelect") {
        return ok(route, FEATURES);
      }
      if (path === "/api/upms/sysUser/getUserByRoleIdNoPage") {
        return ok(route, [{ id: 2, username: "customer" }]);
      }
      if (path === "/api/upms/activity/approvalBuniess") {
        onApproval(
          route.request().postDataJSON
            ? route.request().postDataJSON()
            : route.request().postData()
        );
        return ok(route, null);
      }
      return ok(route, null);
    }
  );
}

test.describe("流程审批", () => {
  test("特性名称按 id 回显，审批意见/审批状态必填", async ({ page }) => {
    const approvals: any[] = [];
    await seedLogin(page, body => approvals.push(body));

    // hash 路由 + 动态菜单：先回首页再点菜单
    await page.goto("/");
    await page.locator("text=流程审批").first().click();
    await expect(page.locator(".app-main")).toBeVisible();
    await expect(page).toHaveURL(/sysActiviti/);

    const taskRow = page.locator("tr", { hasText: "演示项目" }).first();
    await expect(taskRow).toBeVisible();
    await taskRow.getByRole("button", { name: "流程审批" }).click();

    const dialog = page.locator(".el-dialog", { hasText: "流程审批" });
    await expect(dialog).toBeVisible();

    // 1) 特性名称必须按 id 回显成名称（库里是 "1,2"，选项 value 是数字）
    const featureItem = dialog
      .locator(".el-form-item", { hasText: "特性名称" })
      .first();
    await expect(featureItem).toContainText("标准特性");
    await expect(featureItem).toContainText("高级特性");
    await expect(featureItem).not.toContainText("其它特性");

    // 顺带确认其它字段也没走丢
    // 非下拉字段（valueType: copy / textarea）渲染成输入框，值在 input.value 上
    await expect(
      dialog
        .locator(".el-form-item", { hasText: "项目名称" })
        .first()
        .locator("input")
        .first()
    ).toHaveValue("演示项目");

    // 2) 审批意见、审批状态空着点提交：字段级报错 + 不发请求
    await dialog.getByRole("button", { name: /提\s*交/ }).click();
    await expect(
      dialog.locator(".el-form-item__error", { hasText: "审批意见必填" })
    ).toBeVisible();
    await expect(
      dialog.locator(".el-form-item__error", { hasText: "审批状态必填" })
    ).toBeVisible();
    expect(approvals).toEqual([]);

    // 3) 只填意见、不选状态，仍然拦下
    await dialog
      .locator(".el-form-item", { hasText: "审批意见" })
      .locator("textarea")
      .fill("同意扩容");
    await dialog.getByRole("button", { name: /提\s*交/ }).click();
    await expect(
      dialog.locator(".el-form-item__error", { hasText: "审批状态必填" })
    ).toBeVisible();
    expect(approvals).toEqual([]);

    // 4) 补齐审批状态后提交，参数要带上意见与状态
    await dialog
      .locator(".el-form-item", { hasText: "审批状态" })
      .locator(".el-select")
      .click();
    await page
      .locator(".el-select-dropdown__item:visible", { hasText: "通过" })
      .first()
      .click();

    await dialog.getByRole("button", { name: /提\s*交/ }).click();
    await expect.poll(() => approvals.length, { timeout: 10_000 }).toBe(1);
    expect(approvals[0]).toMatchObject({
      businessId: 7,
      businessType: "授权项目变更",
      processInstanceId: 1001,
      operatorStep: 3,
      remark: "同意扩容"
    });
  });
});
