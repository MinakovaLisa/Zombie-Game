import { State, TypeOfCard } from "../../../types";

import { ActionType } from "../../../reducer";
import { getPlayerMoveResult } from "./getPlayerMoveResult";
import { getStateCardSelected } from "../../common/getStateCardSelected";
import { getAvailableCells } from "./getAvailableCells";
import { getStatePlayerMoved } from "./getStatePlayerMoved";

export const playerMove = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "req-checkAvailableNeighboringCell": {
      return getAvailableCells(state);
    }

    case "playerMoved": {
      const direction = action.payload;
      return getStatePlayerMoved(state, direction);
    }

    case "clickedEnemy": {
      const { enemyList, deadPlayerList, activePlayerNumber } = state;
      const currEnemyCard = action.payload.enemyCard;
      const currEnemyCoord = currEnemyCard.coord;

      return state;
      //Need to pull this card to player?
    }

    case "req-getPlayerMoveResult": {
      return getPlayerMoveResult(state);
    }

    //TODO: Rename to inventoryCardClicked-?!
    case "cardChoosed": {
      const typeofCard: TypeOfCard = action.payload.type;
      return getStateCardSelected(state, typeofCard);
    }

    default: {
      return state;
    }
  }
};
