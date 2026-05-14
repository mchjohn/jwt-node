import { SignUpUseCase } from "../useCases/SignUpUseCase.js";

export function makeSignUpUseCase() {
  return new SignUpUseCase();
}
