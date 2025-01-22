import { Permissions, Role } from '@prisma/client';

export const RoleToPermissionsMap: Record<Role, Permissions[]> = {
  SUPER_ADMIN: [
    Permissions.MANAGE_ADMINS,
    Permissions.MANAGE_GAMES,
    Permissions.MANAGE_GUIDES,
    Permissions.MANAGE_USERS,
  ],
  SUB_ADMIN: [
    Permissions.MANAGE_GAMES,
    Permissions.MANAGE_GUIDES,
    Permissions.MANAGE_USERS,
  ],
  MODERATOR: [Permissions.MANAGE_GAMES, Permissions.MANAGE_GUIDES],
};
