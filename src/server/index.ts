import express from "express";

import { makeSignInController } from "../application/factories/makeSignInController.js";
import { makeSignUpController } from "../application/factories/makeSignUpController.js";
import { routeAdapter } from "./adapters/routeAdapter.js";

const PORT = 3001;
const app = express();
app.use(express.json());

app.post("/sign-up", routeAdapter(makeSignUpController()));
app.post("/sign-in", routeAdapter(makeSignInController()));

app.listen(PORT, () => console.log("Server is running!"));
