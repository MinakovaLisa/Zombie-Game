import React, { useMemo } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { State, PlayGridMode } from "../../business/types";
import { useOpenCardAnimation } from "../../business/effects/useOpenCardAnimation";

import { Cell } from "./Cell";

type CellApperance = {
  needHighlightning?: boolean;
  mode: PlayGridMode;
};

type UnderlayerType = {
  coordX: string;
  coordY: string;
};

type CardsListType = "all" | "enemy" | "inventory";
type PlanType = "back" | "front";

const Wrap = styled.div`
  position: relative;
`;

//TODO: при 1 секунде- промаргивание
const ANIMATION_TIME = 2;

//не получится мемозировать из-за объектов селектора?! н-р gameField - object!?
export const FilledPlayGrid: React.FC = React.memo(function _FilledPlayGrid() {
  const dispatch = useDispatch();
  const gameField = useSelector((state: State) => state.gameField);
  const _config = useSelector((state: State) => state._config);

  const memoConfig = useMemo(() => _config, []);
  const needRerenderCard = useSelector((state: State) => {
    const playerCoord = state.playerList[state.activePlayerNumber]?.coord;
    const hasEnemyCard =
      playerCoord &&
      Object.values(state.enemyList).find(
        (enemyItem) => enemyItem.coord === playerCoord
      );

    const hasInventoryCards = gameField.values[playerCoord];

    const needRerenderCard = Boolean(hasEnemyCard || hasInventoryCards);
    return needRerenderCard;
  });

  const getNextPhase = () => {
    //for inventory and for other card ???
    dispatch({ type: "req-openCard" });
  };

  const { cardRef } = useOpenCardAnimation({
    needRun: needRerenderCard,
    maxTime: ANIMATION_TIME,
    onTimerEnd: getNextPhase,
  });

  const memoizedRef = useMemo(() => {
    return cardRef;
  }, []);

  const orderGameCells = gameField.order;

  // const MemoizedWrap = useMemo(() => , []);

  const fullPlayerGrid = orderGameCells.map((orderIndex: string) => {
    const [hor, vert] = orderIndex.split(".");
    return (
      <Wrap key={`${hor}.${vert}`}>
        <Cell
          coord={orderIndex}
          mode={memoConfig.playGridMode}
          cardRef={memoizedRef}
        />
      </Wrap>
    );
  });

  const memoizedPlayerGrid = useMemo(() => fullPlayerGrid, []);

  return <>{memoizedPlayerGrid}</>;
});
