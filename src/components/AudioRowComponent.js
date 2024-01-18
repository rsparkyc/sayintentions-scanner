// RowComponent.js
import React from "react";

const AudioRowComponent = React.memo(
  ({ row, rowClass, filterableFields, addFilter, allowFiltering }) => {
    return (
      <div {...row.getRowProps({ className: rowClass })}>
        {row.cells.map((cell) => {
          // Check if the field is filterable
          if (allowFiltering && filterableFields.includes(cell.column.id)) {
            return (
              <div {...cell.getCellProps()} className="data-cell">
                {cell.render("Cell")}
                <div>
                  <button
                    onClick={() =>
                      addFilter({
                        field: cell.column.id,
                        value: cell.value,
                        type: "include",
                      })
                    }
                  >
                    <i className="fa fa-filter" aria-hidden="true"></i>{" "}
                  </button>
                  <button
                    onClick={() =>
                      addFilter({
                        field: cell.column.id,
                        value: cell.value,
                        type: "exclude",
                      })
                    }
                  >
                    <i
                      className="fa fa-filter-circle-xmark"
                      aria-hidden="true"
                    ></i>{" "}
                  </button>
                </div>
              </div>
            );
          }
          return (
            <div {...cell.getCellProps()} className="data-cell">
              {cell.render("Cell")}
            </div>
          );
        })}
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.id === nextProps.id
);

export default AudioRowComponent;
