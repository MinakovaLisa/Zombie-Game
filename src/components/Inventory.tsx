import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import { State, PlayerListType, HealthCardType } from "../business/types";
import { Health } from "./Health";

type HealthSlotType = {
  onClick: Function;
  highlighting?: boolean;
};

const InventoryWrap = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
`;

const HealthSlot = styled.div<HealthSlotType>`
  display: flex;

  & > * {
    margin: 2px;
    position: relative;
    /*  box-sizing: border-box; */
  }

  outline: ${(props) => {
    if (props.highlighting === true) {
      return "1px solid red ";
    }
  }};
`;

export const Inventory = (props: { index: number }) => {
  const dispatch = useDispatch();
  const { playerList } = useSelector((state: State) => ({
    ...state,
  }));

  const inventory = playerList[props.index].inventory;

  return (
    <InventoryWrap>
      {inventory.map((inventoryCard, inventoryCardindex) => {
        if (inventoryCard.name === "health") {
          return (
            <HealthSlot
              key={inventoryCardindex}
              highlighting={inventoryCard.highlighting}
              onClick={() => {
                dispatch({
                  type: "cardChoosed",
                  payload: inventoryCardindex,
                });
              }}
            >
              <Health></Health>
            </HealthSlot>
          );
        }
      })}
    </InventoryWrap>
  );
};
