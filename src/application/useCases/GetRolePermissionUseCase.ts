import { prismaClient } from "../libs/prismaClient.js";
import type { TRole } from "../types/TRole.js";

interface IInput {
  roleId: string;
}

interface IOutput {
  permissionsCodes: TRole[];
}

export class GetRolePermissionsUseCase {
  async execute({ roleId }: IInput): Promise<IOutput> {
    const rolePermissions = await prismaClient.rolePermission.findMany({
      where: { roleId },
      select: { permissionCode: true },
    });

    const permissionsCodes = rolePermissions.map(
      (rolePermissions) => rolePermissions.permissionCode,
    ) as TRole[];

    return { permissionsCodes };
  }
}
