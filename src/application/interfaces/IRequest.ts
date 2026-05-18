import type { TRole } from "../types/TRole.js";

export interface IRequest {
  body: Record<string, any>;
  headers: Record<string, string>;
  account:
    | {
        id: string;
        role: TRole;
      }
    | undefined;
}
