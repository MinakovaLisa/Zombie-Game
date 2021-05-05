import { State, GameField, PlayerListType, CommonCell } from "../../../types";

import { ActionType } from "../../../reducer";
import { openHealthCard } from "./openHealthCard";
import { deleteHealthCard } from "./deleteHealthCard";
import { changePlayerHealth } from "./changePlayerHealth";

export const takeHealthCard = (action: ActionType, state: State): State => {
  switch (action.type) {
    case "req-openHealthCard": {
      return getStateOpenCard(state);
    }
    case "req-takeHealthCard": {
      return getStateCardTaken(state);
    }

    case "req-changePlayerHealth": {
      return getStateChangedHealth(state);
    }

    case "req-deleteHealthCard": {
      return getStateDeletedCard(state);
    }

    default:
      return state;
  }
};

const getStateOpenCard = (state: State): State => {
  const { gameField, numberOfPlayer, playerList } = state;
  const playerCoordIndex = playerList[numberOfPlayer].coord;
  const healthCell = gameField.values[playerCoordIndex];

  const cellWithOpenHealth = openHealthCard(healthCell);

  const newGameField: GameField = {
    ...gameField,
    values: { ...gameField.values, [playerCoordIndex]: cellWithOpenHealth },
  };

  return {
    ...state,
    gameField: newGameField,
    doEffect: { type: "!takeHealthCard" },
  };
};

const getStateCardTaken = (state: State): State => {
  const { gameField, numberOfPlayer, playerList } = state;
  const player = playerList[numberOfPlayer];

  // We know for sure,that on cell lying only healthCard.
  // TODO: potential problem. Need validate of healthCard.
  const cardItems = gameField.values[player.coord].cardItem;

  /**
   * Extract cardItem with type healthItem. And from it extract HealthCardType
   */
  const healthCard = Object.entries(cardItems)
    .map((cardItem) => {
      const [type, item] = cardItem;
      if (type === "healthItem") {
        return item;
      } else return null;
    })
    .filter((item) => {
      return !null;
    });

  const newPlayer = {
    ...player,
    inventory: [...player.inventory, ...healthCard],
  };

  const newPlayerList: PlayerListType = {
    ...playerList,
    [numberOfPlayer]: newPlayer,
  };

  return {
    ...state,
    doEffect: { type: "!deleteHealthCard" },
    playerList: newPlayerList,
  };
};

const getStateChangedHealth = (state: State): State => {
  const { gameField, numberOfPlayer, playerList } = state;
  const playerCoordIndex = playerList[numberOfPlayer].coord;
  const healthCell = gameField.values[playerCoordIndex];

  const changedPlayerList = changePlayerHealth(
    healthCell,
    playerList,
    numberOfPlayer
  );

  return {
    ...state,
    doEffect: { type: "!deleteHealthCard" },
    playerList: changedPlayerList,
  };
};

const getStateDeletedCard = (state: State): State => {
  const { gameField, numberOfPlayer, playerList } = state;
  const playerCoordIndex = playerList[numberOfPlayer].coord;
  const healthCell = gameField.values[playerCoordIndex];

  const isPlayerAlive = playerList[numberOfPlayer].health > 0;
  const cellWithoutHealthCard = deleteHealthCard(healthCell);

  const newGameField: GameField = {
    ...gameField,
    values: {
      ...gameField.values,
      [playerCoordIndex]: cellWithoutHealthCard,
    },
  };

  switch (true) {
    // TODO: заменить на switchToNextPlayer
    case isPlayerAlive: {
      return {
        ...state,
        gameField: newGameField,
        gameState: {
          type: "gameStarted.getOrder",
        },
        doEffect: {
          type: "!getNextPlayer",
        },
        dice: 0,
      };
    }
    //TODO :общая часть state?
    case !isPlayerAlive: {
      return {
        ...state,
        gameField: newGameField,
        gameState: { type: "endGame" },
        gameResult: "Вы проиграли",
        doEffect: null,
      };
    }

    default:
      return state;
  }
};
