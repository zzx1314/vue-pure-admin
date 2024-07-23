import TypeIt from "@/components/ReTypeit";
import Location from "@iconify-icons/ep/location";
import Iphone from "@iconify-icons/ep/iphone";
import Notebook from "@iconify-icons/ep/notebook";
import User from "@iconify-icons/ri/user-3-fill";

export function useColumns() {
  const columnsA = [
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={User} />
          </el-icon>
          用户名
        </div>
      ),
      value: "张三"
    },
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Iphone} />
          </el-icon>
          手机号
        </div>
      ),
      value: "123456789"
    },
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Location} />
          </el-icon>
          角色
        </div>
      ),
      value: "系统管理员"
    }
  ];
  const columnsC = [
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Notebook} />
          </el-icon>
          描述
        </div>
      ),
      cellRenderer: () => (
        <TypeIt
          className={"github"}
          values={["维护系统运行状态"]}
          cursor={false}
          speed={100}
        />
      )
    }
  ];

  return {
    columnsA,
    columnsC
  };
}
