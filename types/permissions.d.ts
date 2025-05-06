declare namespace Permissions {
  interface PermissionsInfo { 
    permission_id: number;
    permission_name: string;
    description: string;
    parent_id: number;
    create_time: string;
  }
  interface GetPermissionsListApi  {
    list: PermissionsInfo[]
    total: number
  }
}