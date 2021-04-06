import {
  HealthItemTypeArr,
  CoordItem,
  State,
  PlayersListType,
  EnemiesListType,
} from "../types";

import { getGameField } from "./getGameField";
import { getPlayers } from "./getPlayers";
import {getEnemies} from "./getEnemies"

// TODO: создать конфиг-?!
export const START_COORD = { hor: 0, vert: 0 };
export const FINISH_COORD = { hor: 9, vert: 9 };
export const INITIAL_PLAYER_HEALTH = 3;
export const AMOUNT_HEALTH_ITEMS = 30;
export const AMOUNT_PLAYERS = 1;
export const AMOUNT_ENEMIES = 1;
export const WALLS_COORD: Array<CoordItem> = [
  { hor: 2, vert: 2 },
  { hor: 3, vert: 2 },
  { hor: 4, vert: 2 },
  { hor: 2, vert: 3 },
  { hor: 4, vert: 3 },
  { hor: 2, vert: 4 },
  { hor: 3, vert: 4 },
  { hor: 4, vert: 4 },
];
export const HEALTH_ITEM_TYPE_ARR: HealthItemTypeArr = [
  "increment",
  "decrement",
];


const getInitialState = (): State => {
  return {
    gameState: { type: "waitingStart" },
    dice: 0,
    gameResult: "",
    playersList: getPlayers(),
    enemiesList: getEnemies(),
    gameField: getGameField(),
    doEffect: null,
    numberOfPlayer: 0,
  };
};

export const initialState = getInitialState();
