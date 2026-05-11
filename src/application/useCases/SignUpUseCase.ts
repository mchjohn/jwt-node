import { hash } from "bcryptjs";

import { AccountAlreadyExists } from "../erros/AccountAlreadyExists.js";
import { prismaClient } from "../libs/prismaClient.js";

const SALT = 10;

interface IInput {
  name: string;
  email: string;
  password: string;
}

export class SignUpUseCase {
  async execute({ name, email, password }: IInput) {
    const account = await prismaClient.account.count({ where: { email } });

    if (account) {
      throw new AccountAlreadyExists();
    }

    const hashedPassword = await hash(password, SALT);

    await prismaClient.account.create({
      data: { name, email, password: hashedPassword },
    });
  }
}
