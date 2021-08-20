import { State } from "../../../types";
import { getNextPlayerNumber } from "../../common/getNextPlayerNumber";

/**
 * @returns  new state depending on the result of the enemys's movement.
 */

export const getEnemyMoveResult = (state: State) => {
  const {
    gameField,
    playerList,
    activePlayerNumber,
    dice,
    enemyList,
    deadPlayerList,
  } = state;

  const deadPLayerCoord = deadPlayerList
    ? enemyList[deadPlayerList[activePlayerNumber].index].coord
    : null;

  if (deadPLayerCoord) {
    const newCellWithEnemy = gameField.values[deadPLayerCoord];
    const isLastStepOfMove = dice === 1;

    const indexMetPlayerCard = Object.values(playerList).find((playerItem) => {
      return playerItem.coord === deadPLayerCoord;
    })?.orderNumber;

    const metPlayerCard = !indexMetPlayerCard ? false : true;

    // TODO: Is flat switch okey? Or i need it nested?!
    switch (true) {
      case metPlayerCard: {
        if (indexMetPlayerCard) {
          const newState: State = {
            ...state,
            dice: state.dice - 1,
            gameState: { ...state.gameState, type: "interactWithEnemy" },
            doEffect: { type: "!checkApperanceEnemyCard" },
            activePlayerNumber: indexMetPlayerCard,
          };
          return newState;
        } else {
          return state;
        }
      }

      case isLastStepOfMove: {
        const newPlayerNumber = getNextPlayerNumber(state);
        const newState: State = {
          ...state,
          dice: 0,
          gameState: { ...state.gameState, type: "gameStarted.rollDice" },
          activePlayerNumber: newPlayerNumber,
          deadPlayerList: { ...deadPlayerList, [activePlayerNumber]: null },
        };
        return newState;
      }

      default: {
        const newState: State = {
          ...state,
          dice: state.dice - 1,
          /*  gameState: { ...state.gameState, type: "gameStarted.playerMove" }, */
          doEffect: { type: "!checkAvailableNeighboringCell" },
        };
        return newState;
      }
    }
  } else {
    return state;
  }
};
