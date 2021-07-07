import { PlayerList } from "../../components";

import { PlayerListType, PlayerCardType } from "../../business/types";

export const getPlayersList = (
  index: string,
  playersList: PlayerListType,
  numberOfPlayer: number,
  getContextMenu: Function
) => {
  const playerItemList = Object.entries(playersList);

  const playerListOnCell = playerItemList
    .filter((playerItem) => {
      const [, playerCard] = playerItem;
      return playerCard.coord === index;
    })
    .map((playerItem) => {
      const [, playerCard] = playerItem;
      return playerCard;
    });

  const hasPlayerOncell = playerListOnCell.length > 0;

  switch (hasPlayerOncell) {
    case true: {
      return (
        <PlayerList
          playerListOnCell={playerListOnCell}
          getContextMenu={getContextMenu}
          playerList={playersList}
          numberOfPlayer={numberOfPlayer}
        />
      );
    }
    case false: {
      return null;
    }
  }
};
