import { initialState } from "./initialState";
import { waitingStart } from "./phases/waitingStart";
import {
  trownDice,
  clickArrow,
  takeHealthCard,
  getOrder,
  interactEnemyCard,
} from "./phases/gameStarted";
import { endGame } from "./phases/endGame";
import { MoveDirection, State } from "./types";

export type ActionType =
  | { type: "clickedStartButton" }
  | DiceThrownAction
  | ArrowPressAction
  | { type: "req-openHealthCard" }
  | { type: "req-changePlayerHealth" }
  | { type: "req-deleteHealthCard" }
  | { type: "req-getNextPlayer" }
  | { type: "req-checkEnemyCard" }
  | { type: "req-openEnemyCard" }
  | { type: "req-getBattleResult" }
  | { type: "req-getEndScreen" };

export type ArrowPressAction = { type: "arrowPressed"; payload: MoveDirection };

export type DiceThrownAction = { type: "diceThrown"; payload: number };

export const reducer = (
  state: State = initialState,
  action: ActionType
): State => {
  const [phaseOuter, phaseInner] = state.gameState.type.split(".");

  switch (phaseOuter) {
    case "waitingStart": {
      return waitingStart(action, state);
    }

    case "gameStarted": {
      switch (phaseInner) {
        case "trownDice": {
          return trownDice(action, state);
        }

        case "clickArrow": {
          return clickArrow(action, state);
        }

        case "takeHealthCard": {
          return takeHealthCard(action, state);
        }
        case "interactEnemyCard": {
          return interactEnemyCard(action, state);
        }

        case "getOrder": {
          return getOrder(action, state);
        }

        default:
          return state;
      }
    }

    case "endGame": {
      return endGame(action, state);
    }

    default:
      return state;
  }
};
