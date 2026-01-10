export enum Permission {
  VIEW = 'VIEW',
  EDIT = 'EDIT',
}

export interface ShareSetDto {
  setId: string;
  userId: string;
  permission: Permission;
}

export interface UpdatePermissionDto {
  permission: Permission;
}
