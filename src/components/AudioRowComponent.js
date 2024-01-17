// RowComponent.js
import React from "react";

const AudioRowComponent = React.memo(({ row, rowClass }) => {
  return (
    <div {...row.getRowProps({ className: rowClass })}>
      {row.cells.map((cell) => (
        <div {...cell.getCellProps()} className="data-cell">
          {cell.render("Cell")}
        </div>
      ))}
    </div>
  );
});

export default AudioRowComponent;
