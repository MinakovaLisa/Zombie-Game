import styled from "styled-components";

import {
  GameField,
  PlayerListType,
  EnemyListType,
  CommonCell,
} from "../../business/types";

import { getCards } from "./getCards";
import { getPlayersList } from "./getPlayersList";
import { getEnemyList } from "./getEnemyList";

type CellApperance = {
  hasMarker?: boolean;
};

const CellItem = styled.div<CellApperance>`
  position: relative;
  border: 1px solid #ddd1d1;
  box-sizing: content-box;
  width: 30px;
  height: 30px;
  color: lightgrey;
  background-color: ${(props) => {
    if (props.hasMarker) {
      return "pink";
    }
  }};
`;

// TODO: Take out style variable-?!
const CellItemWall = styled.div<CommonCell>`
  position: absolute;
  box-sizing: content-box;
  width: 30px;
  height: 30px;
  color: lightgrey;
  border-top: ${(props) => {
    if (props.surfaceItem) {
      switch (props.surfaceItem.top) {
        case "wall": {
          return "5px solid #f09308";
        }
        case "door": {
          return "2px solid #584324";
        }
        case "window": {
          return "2px solid #669aa7";
        }
        default:
          return "none";
      }
    } else {
      return "none";
    }
  }};

  border-bottom: ${(props) => {
    if (props.surfaceItem) {
      switch (props.surfaceItem.bottom) {
        case "wall": {
          return "5px solid #f09308";
        }
        case "door": {
          return "2px solid #584324";
        }
        case "window": {
          return "2px solid #669aa7";
        }
        default:
          return "none";
      }
    } else {
      return "none";
    }
  }};

  border-left: ${(props) => {
    if (props.surfaceItem) {
      switch (props.surfaceItem.left) {
        case "wall": {
          return "5px solid #f09308";
        }
        case "door": {
          return "2px solid #584324";
        }
        case "window": {
          return "2px solid #669aa7";
        }
        default:
          return "none";
      }
    } else {
      return "none";
    }
  }};
  border-right: ${(props) => {
    if (props.surfaceItem) {
      switch (props.surfaceItem.right) {
        case "wall": {
          return "5px solid #f09308";
        }
        case "door": {
          return "2px solid #584324";
        }
        case "window": {
          return "2px solid #669aa7";
        }
        default:
          return "none";
      }
    } else {
      return "none";
    }
  }};
`;

export const getFilledPlayGrid = (
  gameField: GameField,
  playersList: PlayerListType,
  enemyList: EnemyListType,
  numberOfPlayer: number
) => {
  const orderGameCells = gameField.order;

  const fullPlayerGrid = orderGameCells.map((orderIndex: string) => {
    const cellValues = gameField.values[orderIndex];
    const [hor, vert] = orderIndex.split(".");

    const hasMarker = playersList[
      numberOfPlayer
    ].availableCellsCoords?.includes(orderIndex);

    switch (cellValues.name) {
      case "start":
      case "finish": {
        return (
          <CellItem key={`${hor}${vert}`} hasMarker={hasMarker}>
            {getCards(cellValues)}
            {getPlayersList(orderIndex, playersList, numberOfPlayer)}
            {hor}
            {vert}
          </CellItem>
        );
      }
      case "commonCell": {
        return (
          <CellItem key={`${hor}${vert}`} hasMarker={hasMarker}>
            <CellItemWall key={`${hor}${vert}`} {...cellValues}>
              {getCards(cellValues)}
              {getPlayersList(orderIndex, playersList, numberOfPlayer)}
              {getEnemyList(orderIndex, enemyList)}

              {hor}
              {vert}
            </CellItemWall>
          </CellItem>
        );
      }
      default: {
        return null;
      }
    }
  });

  return fullPlayerGrid;
};
