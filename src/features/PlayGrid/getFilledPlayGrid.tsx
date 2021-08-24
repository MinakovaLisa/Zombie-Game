import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import { State, PlayGridMode } from "../../business/types";
import { getCards } from "./getCards";
import { getPlayersList } from "./getPlayersList";
import { getEnemyList } from "./getEnemyList";
import { Barrier } from "./Barrier";

type CellApperance = {
  needHighlightning?: boolean;
  mode: PlayGridMode;
};

type UnderlayerType = {
  coordX: string;
  coordY: string;
};

const Wrap = styled.div`
  position: relative;
`;

const CellItem = styled.div<CellApperance>`
  display: flex;
  position: relative;
  box-sizing: border-box;

  font-size: 14px;
  text-align: right;
  width: 50px;
  height: 50px;
  color: lightgrey;

  border: ${(props) => {
    if (props.mode === "cssStyle") {
      return "1px solid lightgray";
    }
  }};

  background-color: ${(props) => {
    if (props.needHighlightning) {
      return "rgb(55 163 0 / 52%);";
    }
  }};
`;

const UnderlayerItem = styled.div<UnderlayerType>`
  position: relative;
  display: flex;
  width: 134px;
  height: 100px;
  background-color: rgb(47 84 96 / 77%);
  left: -30px;
  bottom: 120px;
  flex-direction: row;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0px 0px 12px 1px rgb(62 76 81 / 98%);

  left: ${(props) => {
    return `${Number(props.coordX) * 50 - 30}px`;
  }};

  bottom: ${(props) => {
    return `${Number(props.coordY) * 50 + 70}px`;
  }};

  & > * {
    position: relative !important;
    margin: 30px 0;
    width: 50px;
    height: 50px;
    z-index: 3;
  }

  flex-direction: row;
  align-items: center;
`;

export const getFilledPlayGrid = (state: State) => {
  const {
    gameField,
    playerList,
    activePlayerNumber,
    gameState,
    enemyList,
    deadPlayerList,
    _config,
  } = state;
  const orderGameCells = gameField.order;

  const isCurrPlayerAlive = playerList[activePlayerNumber] ? true : false;

  const fullPlayerGrid = orderGameCells.map((orderIndex: string) => {
    const cellValues = gameField.values[orderIndex];
    const [hor, vert] = orderIndex.split(".");

    const cardList = (
      <>
        {getPlayersList(orderIndex, playerList, activePlayerNumber, gameState)}

        {getCards(cellValues, hor, vert)}

        {cellValues.name === "commonCell"
          ? getEnemyList(
              orderIndex,
              enemyList,
              deadPlayerList,
              activePlayerNumber
            )
          : null}
      </>
    );

    const availableCells = state.gameState.coordOfAvailableCells;
    const needHighlightning = availableCells?.includes(orderIndex);

    switch (isCurrPlayerAlive) {
      case false: {
        return (
          <Wrap key={`${hor}.${vert}`}>
            <CellItem
              needHighlightning={needHighlightning}
              mode={_config.playGridMode}
            >
              {cardList}

              {_config.playGridMode === "cssStyle" ? `${hor}.${vert}` : null}
            </CellItem>
            {cellValues.name === "commonCell" ? (
              <Barrier orderIndex={orderIndex}></Barrier>
            ) : null}
          </Wrap>
        );
      }
      case true: {
        const currPlayerCoord = playerList[activePlayerNumber].coord;
        const [playerX, playerY] = currPlayerCoord.split(".");

        const isPhaseCardsSeparate =
          gameState.type.includes("interactWithEnemy") ||
          gameState.type === "gameStarted.takeCard";

        //For creating portal
        const isNeedSepareteCards =
          isPhaseCardsSeparate && playerX === hor && playerY === vert;

        switch (isNeedSepareteCards) {
          case true: {
            const fieildElem = document.getElementById("field");

            switch (fieildElem) {
              case null: {
                return null;
              }

              default: {
                return (
                  <React.Fragment key={`${hor}.${vert}`}>
                    <Wrap key={`${hor}.${vert}`}>
                      <CellItem
                        needHighlightning={needHighlightning}
                        mode={_config.playGridMode}
                      >
                        {_config.playGridMode === "cssStyle"
                          ? `${hor}.${vert}`
                          : null}
                      </CellItem>
                      {cellValues.name === "commonCell" ? (
                        <Barrier orderIndex={orderIndex}></Barrier>
                      ) : null}
                    </Wrap>

                    {ReactDOM.createPortal(
                      <>
                        <UnderlayerItem coordX={hor} coordY={vert}>
                          {cardList}
                        </UnderlayerItem>
                      </>,
                      fieildElem
                    )}
                  </React.Fragment>
                );
              }
            }
          }

          case false: {
            return (
              <Wrap key={`${hor}.${vert}`}>
                <CellItem
                  needHighlightning={needHighlightning}
                  mode={_config.playGridMode}
                >
                  {cardList}

                  {_config.playGridMode === "cssStyle"
                    ? `${hor}.${vert}`
                    : null}
                </CellItem>
                {cellValues.name === "commonCell" ? (
                  <Barrier orderIndex={orderIndex}></Barrier>
                ) : null}
              </Wrap>
            );
          }

          default: {
            return null;
          }
        }
      }
    }
  });

  return fullPlayerGrid;
};
