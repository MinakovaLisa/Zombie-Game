import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import { PlayGrid, MoveControls, Dice } from "./features";
import { StartScreen, EndScreen } from "./pages";
import { State, GameList, PlayersCardType, GameField } from "./business/types";
import { store } from "./business/store";

const Field = styled.div`
  position: relative;
  width: 300px;
  margin: 0 auto;
`;

const Game = styled.div`
  width: 500px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
`;

const LeftPanel = styled.div`
  width: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  flex-grow: 0;
`;

const Status = styled.div`
  border: 1px dotted red;
  color: red;
  width: 150px;
  min-height: 18px;
`;

const showPlayerListHealth = (
  gameField: GameField,
  cardInteractIndex: string[]
): (null | number)[] => {
  //TODO:не сразу понятно, что делает функция, постоянно перезапускается
  const healthArray = cardInteractIndex.map((orderNumber, index) => {
    const cardElem = gameField.values[orderNumber];

    if (cardElem && cardElem.name != "wall" && cardElem.cardItem.playerList) {
      const playerElem = cardElem.cardItem.playerList.find(
        (item: PlayersCardType) => {
          return item.orderNumber === index;
        }
      );
      return playerElem ? playerElem?.health : null;
    } else {
      return null;
    }
  });
  return healthArray;
};

export function GetApp() {
  const {
    gameState,
    gameResult,
    cardInteractIndex,
    gameField,
    doEffect,
  } = useSelector((state: State) => ({ ...state }));

  const dispatch = useDispatch();

  const textPhase = () => {
    switch (gameState.type) {
      case "gameStarted.trownDice":
        return "бросить кубик";
      case "gameStarted.clickArrow":
        return "сделать ход";
      case "gameStarted.takeHealthCard":
        return "открываем карточку";
      case "endGame":
        return gameResult;
      default:
        return " ";
    }
  };

  useEffect(
    function openCard() {
      switch (doEffect?.type) {
        case "!needOpenHealthCard": {
          const timerOpen = setTimeout(
            () =>
              dispatch({
                type: "openedHealthCard",
              }),
            1000
          );
          break;
        }
        case "!changePlayerHealth": {
          const timerChangePlayerHealth = setTimeout(
            () =>
              dispatch({
                type: "changedPlayerHealth",
              }),
            500
          );
          break;
        }
        case "!changeHealthList": {
          const timerChangeHealthList = setTimeout(
            () =>
              dispatch({
                type: "changedHealthList",
              }),
            500
          );
          break;
        }
        case "!getNextPlayer": {
          dispatch({ type: "receivedNextPlayer" });
          break;
        }

        default:
          break;
      }
    },
    [doEffect]
  );

  useEffect(
    function getEndScreen() {
      switch (gameState.type) {
        case "endGame":
          const timer = setTimeout(
            () => dispatch({ type: "getEndScreen" }),
            1000
          );

          return () => clearTimeout(timer);

        default:
          break;
      }
    },
    [gameState.type]
  );

  const getGameScreen = () => {
    switch (gameState.type) {
      case "waitingStart":
        return <StartScreen />;

      case "getEndScreen":
        return <EndScreen />;

      default:
        return (
          <>
            <Field>
              <PlayGrid />
            </Field>
            <LeftPanel>
              <Status>{textPhase()}</Status>
              <Status>{`здоровье: ${showPlayerListHealth(
                gameField,
                cardInteractIndex
              ).toString()}`}</Status>
              <Status>{`координаты: ${cardInteractIndex}`}</Status>
              <Dice />
              <MoveControls />
            </LeftPanel>
          </>
        );
    }
  };

  return <Game>{getGameScreen()}</Game>;
}

export const App = () => {
  return (
    <Provider store={store}>
      <GetApp />
    </Provider>
  );
};
