import { EnemyCardType, EnemyListType, State } from "../../../types";

export const openEnemyCard = (state: State): State => {
  const { enemyList, playerList, numberOfPlayer } = state;
  const currentCoord = playerList[numberOfPlayer].coord;
  /**
   * Need separate method for open EnemyCard
   * Because it dont lying structurally on cell
   */

  const currEnemyCard = enemyList[currentCoord];
  const openedEnemyCard: EnemyCardType = {
    ...currEnemyCard,
    apperance: "open",
  };

  const newEnemyList = { ...enemyList, [currentCoord]: openedEnemyCard };
  return {
    ...state,
    enemyList: newEnemyList,
    //для отрисовки статуса!
    doEffect: { type: "!throwBattleDice" },
    dice: 0,
  };
};
