import TypeIt from "@/components/ReTypeit";
import Role from "@iconify-icons/ri/admin-fill";
import Iphone from "@iconify-icons/ep/user";
import Notebook from "@iconify-icons/ep/notebook";
import User from "@iconify-icons/ri/user-3-fill";
import Dept from "@iconify-icons/ri/organization-chart";

export function useColumns(param) {
  const columnsA = [
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={User} />
          </el-icon>
          账号
        </div>
      ),
      value: param.value.userName
    },
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Dept} />
          </el-icon>
          部门
        </div>
      ),
      value: param.value.orgName
    },
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Iphone} />
          </el-icon>
          用户名
        </div>
      ),
      value: param.value.user
    },
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Role} />
          </el-icon>
          角色
        </div>
      ),
      value: param.value.role
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
          values={[param.value.desc]}
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
