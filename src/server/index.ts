import express from "express";

import { makeAuthenticationMiddleWare } from "../application/factories/makeAuthenticationMiddleWare.js";
import { makeAuthorizationMiddleWare } from "../application/factories/makeAuthorizationMiddleWare.js";
import { makeListCardsController } from "../application/factories/makeListCardsController.js";
import { makeSignInController } from "../application/factories/makeSignInController.js";
import { makeSignUpController } from "../application/factories/makeSignUpController.js";
import { middlewareAdapter } from "./adapters/middlewareAdapter.js";
import { routeAdapter } from "./adapters/routeAdapter.js";

const PORT = 3001;
const app = express();
app.use(express.json());

app.post("/sign-up", routeAdapter(makeSignUpController()));
app.post("/sign-in", routeAdapter(makeSignInController()));

app.get(
  "/cards",
  middlewareAdapter(makeAuthenticationMiddleWare()),
  routeAdapter(makeListCardsController()),
);
app.post(
  "/cards",
  middlewareAdapter(makeAuthenticationMiddleWare()),

  middlewareAdapter(makeAuthorizationMiddleWare(["ADMIN"])),
  (req, res) => res.json({ created: true }),
);

app.listen(PORT, () => console.log("Server is running!"));
