// RowComponent.js
import React from "react";

const AudioRowComponent = React.memo(
  ({ row, rowClass, url }) => {
    return (
      <div {...row.getRowProps({ className: rowClass })}>
        {row.cells.map((cell) => (
          <div {...cell.getCellProps()} className="data-cell">
            {cell.render("Cell")}
          </div>
        ))}
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.url === nextProps.url
);

export default AudioRowComponent;
