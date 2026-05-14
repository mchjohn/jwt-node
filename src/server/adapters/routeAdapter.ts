import type { Request, Response } from "express";

import type { IController } from "../../application/interfaces/IController.js";

export function routeAdapter(controller: IController) {
  return async (request: Request, response: Response) => {
    const { statusCode, body } = await controller.handle({
      body: request.body,
      accountId: request.metadata.accountId
    });

    response.status(statusCode).json(body);
  };
}
