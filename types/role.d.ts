declare namespace Role {

  interface RoleInfo {
    role_id: number;
    role_name: string;
    description: string;
    create_time: string;
    permissions_ids: number[];
    menu_ids: number[];
  }
  type RoleTableRow = Omit<Required<Role.RoleInfo>, "permissions_ids" | "menu_ids"> 
  interface GetRoleListApi {
    list: RoleTableRow[]
    total: number
  }
}