declare module "echarts-liquidfill" {
  import type { EChartsExtensionModule } from "echarts";

  export const version: string;
  export function install(registers: EChartsExtensionModule): void;
}
