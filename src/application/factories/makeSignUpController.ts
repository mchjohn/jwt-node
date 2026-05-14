import { SignUpController } from "../controllers/SignUpController.js";
import { SignUpUseCase } from "../useCases/SignUpUseCase.js";

export function makeSignUpController() {
  const signUpUseCase = new SignUpUseCase();

  return new SignUpController(signUpUseCase);
}
