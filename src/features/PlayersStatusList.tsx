import { useSelector } from "react-redux";

import styled from "styled-components";

import {
  State,
  GameState,
  TypeEffect,
  PlayerListType,
} from "../business/types";

import { AMOUNT_PLAYERS, MAX_HEALTH_AMOUNT } from "../shared/config";

type HealthSlotType = {
  isFilled: boolean;
};

type AmountOfPlayers = {
  amount: number;
};

const PlayersListWrap = styled.div<AmountOfPlayers>`
  width: 250px;
  height: 100px;
  border: 1px solid lightgray;
  display: grid;

  grid-template-columns: 20% auto auto;
  grid-template-rows: ${(props) => {
    return `repeat(${props.amount} ,25px)`;
  }};
`;

const PlayerCommonStatus = styled.div`
  grid-column-start: 1;
  grid-column-end: 4;
  border: 1px solid #d5c0c0;
`;

const CharacterAvatar = styled.div`
  font-size: 11px;
  grid-column-start: 1;
  grid-column-end: 2;
`;

const HealthSlotList = styled.div`
  display: flex;
  height: 15px;
  align-items: center;
  grid-column-start: 2;
  grid-column-end: 3;
`;
const HealthSlot = styled.div<HealthSlotType>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  border: 1px solid #f09292;
  margin: 1px;
  background-color: ${(props) => {
    if (props.isFilled) {
      return "#f09292";
    } else return "none";
  }};
`;

export const PlayersStatusList = () => {
  const { playerList, numberOfPlayer } = useSelector((state: State) => ({
    ...state,
  }));

  return (
    <PlayersListWrap amount={AMOUNT_PLAYERS}>
      {new Array(AMOUNT_PLAYERS).fill(0).map((player, index) => {
        return (
          /*  <PlayerCommonStatus> */
          <>
            <CharacterAvatar>{`${index + 1}`}</CharacterAvatar>
            <HealthSlotList>
              {getHealthSlot(playerList, index).map(
                (healthSlotFilled: boolean) => {
                  return <HealthSlot isFilled={healthSlotFilled}></HealthSlot>;
                }
              )}
            </HealthSlotList>
          </>
          /*  </PlayerCommonStatus> */
        );
      })}
    </PlayersListWrap>
  );
};

const getHealthSlot = (playersList: PlayerListType, index: number) => {
  const playerHealth = getPlayerHealth(playersList, index);
  const maxHealthSlotList = new Array(MAX_HEALTH_AMOUNT).fill(0);

  const filledHealthSlotList = maxHealthSlotList.reduce(
    (prev, currSlot, index) => {
      if (index < playerHealth) {
        return [...prev, true];
      } else {
        return [...prev, false];
      }
    },
    []
  );
  return filledHealthSlotList;
};

const getPlayerHealth = (
  playersList: PlayerListType,
  numberOfPlayer: number
) => {
  return playersList[numberOfPlayer].health;
};
