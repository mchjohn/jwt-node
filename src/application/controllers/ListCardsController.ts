import type {
  IController,
  IRequest,
  IResponse,
} from "../interfaces/IController.js";

export class ListCardsController implements IController {
  async handle({ accountId }: IRequest): Promise<IResponse> {
    console.log({ accountId })

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
