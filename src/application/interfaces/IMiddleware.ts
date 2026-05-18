import type { IRequest } from "./IRequest.js";

export interface IResponse {
  statusCode: 200 | number;
  body: Record<string, any> | null;
}

export interface IData {
  data: Record<string, any>;
}

export interface IMiddleware {
  handle(request: IRequest): Promise<IResponse | IData>;
}
