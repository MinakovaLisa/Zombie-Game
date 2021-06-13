import { initialState } from "./initialState";
import { waitingStart } from "./phases/waitingStart";
import {
  trownDice,
  playerMove,
  takeCard,
  interactEnemyCard,
  applyCard,
} from "./phases/gameStarted";
import { getPlayersOrder } from "./phases/gameStarted";
import { endGame } from "./phases/endGame";
import { MoveDirection, State, CardItem } from "./types";
import { DOMElement } from "react";

export type ActionType =
  | { type: "clickedStartButton" }
  | { type: "diceThrown"; payload: number }
  | { type: "playerMoved"; payload: MoveDirection }
  | { type: "req-openCard" }
  | { type: "req-changePlayerHealth" }
  | { type: "req-deleteCard" }
  | { type: "req-getNextPlayer" }
  | { type: "req-checkEnemyCard" }
  | { type: "req-openEnemyCard" }
  | { type: "req-getBattleResult" }
  | { type: "req-getEndScreen" }
  | { type: "req-checkAvailableNeighboringCell" }
  | { type: "req-cleanAvailableCells" }
  | { type: "req-getPlayerMoveResult" }
  | { type: "req-takeCard" }
  | {
      type: "cardChoosed";
      payload: {
        index: number;
        card: CardItem;
      };
    }
  | { type: "req-choosePlayer" }
  | { type: "req-healPlayer"; payload: number }
  | {
      type: "req-fillHole";
      payload: { coord: number; direction: MoveDirection };
    }
  | { type: "req-shareCard"; payload: number };

export const reducer = (
  state: State = initialState,
  action: ActionType
): State => {
  const [phaseOuter, phaseInner] = state.gameState.type.split(".");

  switch (phaseOuter) {
    case "waitingStart": {
      return waitingStart(state, action);
    }

    case "gameStarted": {
      switch (phaseInner) {
        case "trownDice": {
          return trownDice(state, action);
        }

        case "playerMove": {
          return playerMove(state, action);
        }

        case "takeCard": {
          return takeCard(state, action);
        }
        case "applyCard": {
          return applyCard(state, action);
        }

        case "interactEnemyCard": {
          return interactEnemyCard(state, action);
        }

        case "getPlayersOrder": {
          return getPlayersOrder(state, action);
        }

        default:
          return state;
      }
    }

    case "endGame": {
      return endGame(state, action);
    }

    default:
      return state;
  }
};
