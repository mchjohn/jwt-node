import { GetRolePermissionsUseCase } from "../useCases/GetRolePermissionUseCase.js";

export function makeGetRolePermissionUseCase() {
  return new GetRolePermissionsUseCase();
}
