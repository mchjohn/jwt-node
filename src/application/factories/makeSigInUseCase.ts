import { SignInUseCase } from "../useCases/SignInUseCase.js";

export function makeSigInUseCase() {
  return new SignInUseCase();
}
