import { EnemyCardType, EnemyListType, State } from "../../types";

/**
 * Need separate method for open EnemyCard
 * Because it dont lying structurally on cell
 */
export const openEnemyCard = (state: State): State => {
  const { enemyList, playerList, activePlayerNumber } = state;
  const currentCoord = playerList[activePlayerNumber].coord;

  const currEnemyCard = enemyList[currentCoord];
  const openedEnemyCard: EnemyCardType = {
    ...currEnemyCard,
    apperance: "open",
  };

  const newEnemyList = { ...enemyList, [currentCoord]: openedEnemyCard };
  return {
    ...state,
    enemyList: newEnemyList,
    gameState: {
      ...state.gameState,
      type: "interactWithEnemy.throwBattleDice",
    },
    dice: 0,
  };
};
