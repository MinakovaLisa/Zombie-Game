import { useDispatch, useSelector } from "react-redux";

import { State, HealthCardType, PlayerListType } from "../../types";

/**
 * We need to give highlighting to healthCard
 */
export const getStateCardChosed = (state: State, currentCardIndex: number) => {
  const hasAnyCardHighlightning = findAnyHighlightning(state);
  const hasCurrentCardHighlightning = findCurrentCardHighlightning(
    state,
    currentCardIndex
  );

  const newPlayerList = changeHighlightningInventory(
    state,
    currentCardIndex,
    hasCurrentCardHighlightning
  );

  const stateWithChangingHighlightning: State = {
    ...state,
    playerList: newPlayerList,
    gameState: {
      type: "gameStarted.applyCard",
    },
  };

  switch (hasCurrentCardHighlightning) {
    case true: {
      return stateWithChangingHighlightning;
    }

    case false: {
      switch (hasAnyCardHighlightning) {
        case false: {
          return stateWithChangingHighlightning;
        }

        case true: {
          return state;
        }
      }
    }
  }
};

/**
 * Just returns the opposite of current highlightning.
 */
const changeHighlightningInventory = (
  state: State,
  currentCardIndex: number,
  hasCurrentCardHighlightning: boolean
) => {
  const { playerList, numberOfPlayer } = state;
  const inventory = playerList[numberOfPlayer].inventory;
  const choosenHealthCard = inventory[currentCardIndex];

  const highlightHealthCard = {
    ...choosenHealthCard,
    highlighting: !hasCurrentCardHighlightning,
  };

  const newInventory = inventory.map((card, index) => {
    if (index === currentCardIndex) {
      return highlightHealthCard;
    } else return card;
  });

  const newPlayerList: PlayerListType = {
    ...playerList,
    [numberOfPlayer]: {
      ...playerList[numberOfPlayer],
      inventory: newInventory,
    },
  };
  return newPlayerList;
};

const findAnyHighlightning = (state: State): boolean => {
  const { playerList, numberOfPlayer } = state;
  const inventory = playerList[numberOfPlayer].inventory;

  const hasAnyCardHighlightning = inventory.find((card) => {
    return card.highlighting === true;
  })
    ? true
    : false;
  return hasAnyCardHighlightning;
};

const findCurrentCardHighlightning = (
  state: State,
  currentCardIndex: number
): boolean => {
  const { playerList, numberOfPlayer } = state;
  const inventory = playerList[numberOfPlayer].inventory;

  const choosenHealthCard = inventory[currentCardIndex];

  const hasCurrentCardHighlightning = choosenHealthCard.highlighting
    ? true
    : false;

  return hasCurrentCardHighlightning;
};
