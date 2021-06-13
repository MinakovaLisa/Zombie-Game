import { State } from "../../types";
import { ActionType } from "../../reducer";

export const waitingStart = ( state: State,action: ActionType): State => {
  switch (action.type) {
    case "clickedStartButton": {
      return {
        ...state,
        gameState: {
          type: "gameStarted.trownDice",
        },
      };
    }
    default:
      return state;
  }
};
