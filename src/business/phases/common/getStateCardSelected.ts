import {
  State,
  PlayerListType,
  CardItem,
  TypeOfCard,
  InventoryType,
} from "../../types";

/**
 * We need to give highlighting to healthCard
 */

export const getStateCardSelected = (
  state: State,
  typeOfSelect: TypeOfCard
) => {
  // TODO: Need to restrict select unneceserry card -?!
  // Add switch on type of cards
  const { activePlayerNumber } = state;

  const newPlayerList = changeSelectedCard(state, typeOfSelect);

  const selectedCard = newPlayerList[activePlayerNumber].inventory.cardSelected
    ? true
    : false;

  // The difference between weaponCard and other card that weapon are used in the battle.
  //Obviously we need other stateWithoutSelectedCard for weapon
  const stateWithSelectedCard: State = {
    ...state,
    playerList: newPlayerList,
    gameState: {
      type: "gameStarted.applyCard",
      coordOfAvailableCells: null,
    },
  };

  const stateWithoutSelectedCard: State = {
    ...state,
    playerList: newPlayerList,
    gameState: {
      ...state.gameState,
      type: /* cardType === "weapon"
          ? "gameStarted.interactWithEnemy"
          :  */ "gameStarted.playerMove",
    },
    doEffect: { type: "!checkAvailableNeighboringCell" },
  };

  switch (selectedCard) {
    case true:
      return stateWithSelectedCard;
    case false:
      return stateWithoutSelectedCard;
  }
};

const changeSelectedCard = (state: State, typeOfSelect: TypeOfCard) => {
  const { playerList, activePlayerNumber } = state;
  const inventory = playerList[activePlayerNumber].inventory;
  if (typeOfSelect !== null) {
    const isTheSameSelectType = inventory.cardSelected === typeOfSelect;
    const hasCards = inventory[typeOfSelect] !== 0;

    switch (hasCards) {
      case true: {
        switch (isTheSameSelectType) {
          case true: {
            const newInventoryCardUnSelected: InventoryType = {
              ...inventory,
              cardSelected: null,
            };

            const newPlayerList: PlayerListType = {
              ...playerList,
              [activePlayerNumber]: {
                ...playerList[activePlayerNumber],
                inventory: newInventoryCardUnSelected,
              },
            };

            return newPlayerList;
          }

          case false: {
            const newInventoryCardSelected: InventoryType = {
              ...inventory,
              cardSelected: typeOfSelect,
            };

            const newPlayerList: PlayerListType = {
              ...playerList,
              [activePlayerNumber]: {
                ...playerList[activePlayerNumber],
                inventory: newInventoryCardSelected,
              },
            };

            return newPlayerList;
          }
        }
      }

      case false: {
        return playerList;
      }
    }
  } else {
    return playerList;
  }
};
