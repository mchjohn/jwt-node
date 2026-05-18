import type {
  IData,
  IMiddleware,
  IResponse,
} from "../interfaces/IMiddleware.js";
import type { IRequest } from "../interfaces/IRequest.js";
import type { TRole } from "../types/TRole.js";

export class AuthorizationMiddleware implements IMiddleware {
  constructor(private readonly ALLOWED_ROLES: TRole[]) {}

  async handle({ account }: IRequest): Promise<IResponse | IData> {
    if (!account) {
      return { statusCode: 403, body: { error: "Access Denied." } };
    }

    if (!this.ALLOWED_ROLES.includes(account.role)) {
      return { statusCode: 403, body: { error: "Access Denied." } };
    }

    return { data: {} };
  }
}
