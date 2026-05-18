import { AuthorizationMiddleware } from "../middlewares/AuthorizationMiddleware.js";
import type { TRole } from "../types/TRole.js";

export function makeAuthorizationMiddleWare(ALLOWED_ROLES: TRole[]) {
  return new AuthorizationMiddleware(ALLOWED_ROLES);
}
