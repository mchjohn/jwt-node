import jwt from "jsonwebtoken";

import { ENV } from "../../config/env.js";
import type {
  IData,
  IMiddleware,
  IRequest,
  IResponse,
} from "../interfaces/IMiddleware.js";

export class AuthenticationMiddleware implements IMiddleware {
  async handle({ headers }: IRequest): Promise<IResponse | IData> {
    const { authorization } = headers;

    if (!authorization) {
      return {
        statusCode: 401,
        body: {
          message: "Invalid credentials.",
        },
      };
    }

    try {
      const [bearer, accessToken] = authorization.split(" ");

      if (bearer !== "Bearer") {
        throw new Error()
      }

      const payload = jwt.verify(accessToken as string, ENV.JWT_SECRET);

      return {
        data: {
          accountId: payload.sub,
        },
      };
    } catch {
      return {
        statusCode: 401,
        body: {
          message: "Invalid credentials.",
        },
      };
    }
  }
}
