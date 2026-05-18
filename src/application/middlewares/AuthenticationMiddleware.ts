import jwt, { type JwtPayload } from "jsonwebtoken";

import { ENV } from "../../config/env.js";
import type {
  IData,
  IMiddleware,
  IResponse,
} from "../interfaces/IMiddleware.js";
import type { IRequest } from "../interfaces/IRequest.js";

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
        throw new Error();
      }

      const payload = jwt.verify(
        accessToken as string,
        ENV.JWT_SECRET,
      ) as JwtPayload;

      return {
        data: {
          account: {
            id: payload.sub,
            role: payload.role,
          },
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
