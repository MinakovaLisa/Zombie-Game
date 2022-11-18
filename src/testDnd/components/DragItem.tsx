import type { CSSProperties, FC } from "react";
import { useDrag } from "react-dnd";

import { ItemTypes } from "./ItemTypes";

const style: CSSProperties = {
  border: "1px dashed gray",
  backgroundColor: "white",
  padding: "0.5rem 1rem",
  marginRight: "1.5rem",
  marginBottom: "1.5rem",
  cursor: "move",
  float: "left",
};

export type BoxProps = {
  keyIndex: number;
  //TODO: добавить и string
  item: number | string;
};

interface DropResult {
  name: string;
}

export const DragItem: FC<BoxProps> = function Box({ keyIndex, item }) {
  console.log("item", item);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: { item },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
        console.log(`You dropped ${item.item} into ${dropResult.name}!`);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const opacity = isDragging ? 0 : 1;
  return (
    <div ref={drag} style={{ ...style, opacity }} data-testid={`box`}>
      {item}
    </div>
  );
};
