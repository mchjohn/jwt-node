import { SignInController } from "../controllers/SignInController.js";
import { SignInUseCase } from "../useCases/SignInUseCase.js";

export function makeSignInController() {
  const signInUseCase = new SignInUseCase();

  return new SignInController(signInUseCase);
}
