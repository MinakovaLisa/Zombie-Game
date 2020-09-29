import { State, ActionType } from "./../../app";

function trownDice(action: ActionType, state: State): State {
  switch (action.type) {
    case "diceThrown": {
      return {
        ...state,
        dice: action.payload,
        gameState: {
          type: "gameStarted.clickArrow",
          gameStartedContext: {},
          context: {},
        },
      };
    }
    default:
      return state;
  }
}

export default trownDice;
