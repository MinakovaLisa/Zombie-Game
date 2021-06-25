import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import {
  PlayerCardType,
  AvailableCellListType,
  State,
} from "../../business/types";
import { getNeighboringCellList } from "../../business/phases/common/getNeighboringCellList";
import { canInteractWithCell } from "./canInteractWithCell";

import img from "./player.png";

type PlayerItem = {
  isCurrent: boolean;
  needHighlightning?: boolean;
};

type PlayerListItem = {
  playerListOnCell: PlayerCardType[];
  getContextMenu: Function;
};

type ContextMenuType = {
  visible: boolean;
};

type TypeOfCard = "boards" | "health" | "weapon" | null;

const PlayerCard = styled.div<PlayerItem>`
  /*   background-color: #9f3f3f; */

  width: 20px;
  height: 40px;
  margin: 0px;
  z-index: 3;
  text-align: center;
  padding: 4px;
  box-sizing: border-box;
  cursor: default;
  background-repeat: no-repeat;
  background-position: -9px;
  /*  background-color: ${(props) => {
    if (props.isCurrent) {
      return "red";
    }
  }}; */

  background-image: url(${img});
  background-size: 40px;

  &:before {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: ${(props) => {
      if (props.needHighlightning) {
        return "3px solid #34b834;";
      }
    }};
    pointer-events: none;
    opacity: 0.5;
    padding: 4px;

    left: -3px;
    top: -3px;
  }
`;

const PlayerCardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  z-index: 3;
  font-size: 12px;
  font-weight: bold;
  color: white;
  /*   padding: 3px; */
  margin: 3px;
`;

export const PlayerList = (props: PlayerListItem) => {
  const dispatch = useDispatch();
  const state = useSelector((state: State) => ({
    ...state,
  }));
  const { playerList, numberOfPlayer } = state;

  /**
   *  playerListOnCell -is all player in one cell
   */
  const { playerListOnCell, getContextMenu } = props;

  const listForInteract = getAvailableCellList(state);
  const currPlayerCoord = playerList[numberOfPlayer].coord;
  const listForHealing = listForInteract.concat(currPlayerCoord);
  const currPlayer = playerList[numberOfPlayer];
  const chosedCard = currPlayer.inventory.find(
    (card) => card?.isSelected === true
  );
  const typeOfChosedCard = chosedCard?.name || null;

  return (
    <PlayerCardList>
      {playerListOnCell.map((playerCardItem, index) => {
        const canInteractWithPlayer = listForInteract.includes(
          playerCardItem.coord
        );
        const canHealPlayer = listForHealing.includes(playerCardItem.coord);

        return (
          <PlayerCard
            id={`player${playerCardItem.orderNumber}`}
            key={index}
            isCurrent={numberOfPlayer == playerCardItem.orderNumber}
            needHighlightning={calculateHighlightning(
              canInteractWithPlayer,
              canHealPlayer,
              typeOfChosedCard
            )}
            onClick={() => {
              playerClickedHandler(
                getContextMenu,
                playerCardItem,
                numberOfPlayer,
                canInteractWithPlayer,
                typeOfChosedCard,
                dispatch
              );
            }}
          ></PlayerCard>
        );
      })}
    </PlayerCardList>
  );
};

const getAvailableCellList = (state: State) => {
  const { gameState, playerList, numberOfPlayer, gameField } = state;
  const prevPlayerCoord = playerList[numberOfPlayer].coord;
  const neighboringCellList = getNeighboringCellList(
    prevPlayerCoord,
    gameField
  );
  const availableCellList: AvailableCellListType = neighboringCellList.filter(
    (cellItem) => {
      const { direction, coord } = cellItem;

      return canInteractWithCell(state, coord, direction);
    }
  );

  const availableCellsCoords = availableCellList.map((cellItem) => {
    const { direction, coord } = cellItem;
    return coord;
  });

  switch (gameState.type) {
    case "gameStarted.applyCard":
      return availableCellsCoords;

    default:
      return [];
  }
};

const playerClickedHandler = (
  getContextMenu: Function,
  playerCardItem: PlayerCardType,
  numberOfPlayer: number,
  canInteractWithPlayer: boolean,
  typeOfChosedCard: TypeOfCard,
  dispatch: Function
) => {
  const isCurrentPlayer = playerCardItem.orderNumber == numberOfPlayer;
  switch (canInteractWithPlayer) {
    case true: {
      switch (typeOfChosedCard) {
        case "health": {
          switch (isCurrentPlayer) {
            case true: {
              dispatch({
                type: "req-healPlayer",
                payload: playerCardItem.orderNumber,
              });
              break;
            }

            case false: {
              getContextMenu(playerCardItem.orderNumber);
            }
          }

          break;
        }
        case "weapon":
        case "boards": {
          /**
           * For preventing sharing any cards with himself
           */
          switch (isCurrentPlayer) {
            case true: {
              break;
            }
            case false: {
              dispatch({
                type: "req-shareCard",
                payload: playerCardItem.orderNumber,
              });
              break;
            }
          }
        }
      }
      break;
    }
    case false: {
      console.log("не можем взаимодействовать с игроком игрока");
      break;
    }
    default:
      break;
  }
};

const calculateHighlightning = (
  canInteractWithPlayer: boolean,
  canHealPlayer: boolean,
  typeOfChosedCard: TypeOfCard
) => {
  switch (canHealPlayer) {
    case true: {
      switch (typeOfChosedCard) {
        case "health": {
          return true;
        }

        case "weapon":
        case "boards": {
          switch (canInteractWithPlayer) {
            case true: {
              return true;
            }
            case false: {
              return false;
            }
          }
        }
        default: {
          return false;
        }
      }
    }
    case false: {
      return false;
    }
  }
};
