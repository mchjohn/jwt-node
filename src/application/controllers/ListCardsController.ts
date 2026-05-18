import type { IController, IResponse } from "../interfaces/IController.js";
import type { IRequest } from "../interfaces/IRequest.js";

export class ListCardsController implements IController {
  async handle({ account }: IRequest): Promise<IResponse> {
    console.log({ account });

    return {
      statusCode: 200,
      body: {
        cards: [
          { id: "1", name: "Samwise the Stouthearted" },
          { id: "2", name: "Gandalf, Friend of the Shire" },
          { id: "3", name: "Arwen, Mortal Queen" },
        ],
      },
    };
  }
}
