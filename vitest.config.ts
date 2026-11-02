import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { alias } from "./build/utils";

export default defineConfig({
  plugins: [vue()],
  resolve: { alias },
  test: {
    // 组件用 happy-dom（比 jsdom 快），纯工具函数测试同样适用
    environment: "happy-dom",
    include: ["tests/unit/**/*.test.ts"],
    globals: true,
    restoreMocks: true,
    reporters: ["default"]
  }
});
