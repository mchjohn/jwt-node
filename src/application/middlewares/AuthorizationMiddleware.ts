import type {
  IData,
  IMiddleware,
  IResponse,
} from "../interfaces/IMiddleware.js";
import type { IRequest } from "../interfaces/IRequest.js";
import type { TRole } from "../types/TRole.js";
import type { GetRolePermissionsUseCase } from "../useCases/GetRolePermissionUseCase.js";

export class AuthorizationMiddleware implements IMiddleware {
  constructor(
    private readonly ALLOWED_ROLES: TRole[],
    private readonly getRolePermissionUseCase: GetRolePermissionsUseCase,
  ) {}

  async handle({ account }: IRequest): Promise<IResponse | IData> {
    if (!account) {
      return { statusCode: 403, body: { error: "Access Denied." } };
    }

    const { permissionsCodes } = await this.getRolePermissionUseCase.execute({
      roleId: account.role,
    });

    const isAllowed = this.ALLOWED_ROLES.some((code) =>
      permissionsCodes.includes(code),
    );

    if (!isAllowed) {
      return { statusCode: 403, body: { error: "Access Denied." } };
    }

    return { data: {} };
  }
}
