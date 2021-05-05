import styled from "styled-components";

import { HealthCardType } from "../business/types";

type HealthApperanceType = {
  apperance?: "closed" | "open";
};

export const StyledHealthCard = styled.div<HealthApperanceType>`
  position: absolute;
  border: 5px solid;
  width: 15px;
  height: 15px;
  margin: 12px;

  background-color: ${(props) => {
    if (props.apperance === "closed") {
      return "gray";
    } else {
      return "green";
    }
  }};

  border-color: ${(props) => {
    if (props.apperance === "closed") {
      return "gray";
    } else {
      return "green";
    }
  }};
`;

export const Health = (props: HealthApperanceType) => {
  return <StyledHealthCard {...props}></StyledHealthCard>;
};
