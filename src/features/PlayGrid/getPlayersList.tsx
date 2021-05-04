import { PlayerList } from "../../components";

import { PlayerListType, PlayerCardType } from "../../business/types";

export const getPlayersList = (
  index: string,
  playersList: PlayerListType,
  numberOfPlayer: number,
  getContextMenu: Function
) => {
  let playersArr: PlayerCardType[] = [];

  for (let playerKey in playersList) {
    const playerCard = playersList[playerKey];
    const playerCoord = playerCard.coord;
    if (playerCoord === index) {
      playersArr.push(playersList[playerKey]);
    }
  }
  if (playersArr.length > 0) {
    return (
      <PlayerList
        playerList={playersArr}
        numberOfPlayer={numberOfPlayer}
        getContextMenu={getContextMenu}
      />
    );
  } else return null;
};
