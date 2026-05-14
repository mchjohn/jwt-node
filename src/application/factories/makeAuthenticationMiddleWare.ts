import { AuthenticationMiddleware } from "../middlewares/AuthenticationMiddleware.js";

export function makeAuthenticationMiddleWare() {
  return new AuthenticationMiddleware();
}
