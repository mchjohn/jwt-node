import z, { ZodError } from "zod";

import { AccountAlreadyExists } from "../erros/AccountAlreadyExists.js";
import type { IController, IResponse } from "../interfaces/IController.js";
import type { IRequest } from "../interfaces/IRequest.js";
import type { SignUpUseCase } from "../useCases/SignUpUseCase.js";

const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
});

export class SignUpController implements IController {
  constructor(private readonly signUpUseCase: SignUpUseCase) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    try {
      const { name, email, password } = schema.parse(body);

      await this.signUpUseCase.execute({ name, email, password });

      return {
        statusCode: 204,
        body: null,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          statusCode: 400,
          body: error.issues,
        };
      }

      if (error instanceof AccountAlreadyExists) {
        return {
          statusCode: 409,
          body: { error: "Email already in use." },
        };
      }

      throw error;
    }
  }
}
