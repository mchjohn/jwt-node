import { compare } from "bcryptjs";
import jwt from 'jsonwebtoken';

import { ENV } from "../../config/env.js";
import { InvalidCrendentials } from "../erros/InvalidCrendentials.js";
import { prismaClient } from "../libs/prismaClient.js";

interface IInput {
  email: string;
  password: string;
}

interface IOutput {
  accessToken: string;
}

export class SignInUseCase {
  async execute({ email, password }: IInput): Promise<IOutput> {
    const account = await prismaClient.account.findUnique({
      where: { email },
      select: { id: true, password: true },
    });

    if (!account) {
      throw new InvalidCrendentials();
    }

    const validPassword = await compare(password, account.password);

    if (!validPassword) {
      throw new InvalidCrendentials();
    }

    const accessToken = jwt.sign(
      {
        sub: account.id,
      },
      ENV.JWT_SECRET,
      { expiresIn: "2d" },
    );

    return { accessToken };
  }
}
