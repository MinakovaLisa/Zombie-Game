import { EnemyListType, GameState, State } from "../../types";
import { getNextPlayerNumber } from "../common/getNextPlayerNumber";

export const removeEnemyCard = (state: State): State => {
  const { enemyList, activePlayerNumber, playerList, gameState, gameField } =
    state;

  const currentCoord = playerList[activePlayerNumber].coord;

  const newEnemyArray = Object.entries(enemyList).filter((enemyItem) => {
    const [, enemyCard] = enemyItem;
    return enemyCard.coord !== currentCoord;
  });
  const newEnemyList: EnemyListType = Object.fromEntries(newEnemyArray);

  const newPlayerNumber = getNextPlayerNumber(state);

  const { attackInitiator, ...newGameState } = gameState;

  const cellHasCard = gameField.values[currentCoord].cardItem.length > 0;

  switch (cellHasCard) {
    case true: {
      return {
        ...state,
        enemyList: newEnemyList,
        dice: 0,
        gameState: {
          ...newGameState,
          type: "gameStarted.takeCard",
        },
        doEffect: { type: "!checkApperanceInventoryCard" },
      };
    }

    case false: {
      return {
        ...state,
        enemyList: newEnemyList,
        dice: 0,
        gameState: {
          ...newGameState,
          type: "gameStarted.rollDice",
        },
        activePlayerNumber: newPlayerNumber,
      };
    }
  }
};
