import express from "express";

import { SignInController } from "../application/controllers/SignInController.js";
import { SignUpController } from "../application/controllers/SignUpController.js";
import { SignInUseCase } from "../application/useCases/SignInUseCase.js";
import { SignUpUseCase } from "../application/useCases/SignUpUseCase.js";

const PORT = 3001;
const app = express();
app.use(express.json());

app.post("/sign-up", async (request, response) => {
  const signUpUseCase = new SignUpUseCase();
  const signUpController = new SignUpController(signUpUseCase);

  const { statusCode, body } = await signUpController.handle({
    body: request.body,
  });

  response.status(statusCode).json(body);
});

app.post("/sign-in", async (request, response) => {
  const signInUseCase = new SignInUseCase();
  const signInController = new SignInController(signInUseCase);

  const { statusCode, body } = await signInController.handle({
    body: request.body,
  });

  response.status(statusCode).json(body);
});

app.listen(PORT, () => console.log("Server is running!"));
