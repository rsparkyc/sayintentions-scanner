import React from "react";
import { useTable } from "react-table";

function AudioTableComponent({ data }) {
  // Define columns
  const columns = React.useMemo(
    () => [
      {
        Header: "User ID",
        accessor: "from_userid",
      },
      {
        Header: "Time Stamp",
        accessor: "stamp",
      },
      {
        Header: "Message (incoming)",
        accessor: "incoming_message",
      },
      // Define other columns similarly
      {
        Header: "Audio",
        accessor: "url",
        Cell: ({ value }) =>
          value && (
            <>
              <audio controls preload="none">
                <source src={value} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <a href={value} target="_blank" rel="noopener noreferrer">
                Link
              </a>
            </>
          ),
      },
    ],
    []
  );

  // Use the useTable hook to create table configuration
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  // Render the table UI
  return (
    <div className="App">
      <main className="data-container">
        <div {...getTableProps()} className="table">
          <div className="header-row">
            {headerGroups.map((headerGroup) => (
              <div {...headerGroup.getHeaderGroupProps()} className="header">
                {headerGroup.headers.map((column) => (
                  <div {...column.getHeaderProps()} className="header-cell">
                    {column.render("Header")}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <div {...row.getRowProps()} className="data-row">
                  {row.cells.map((cell) => {
                    return (
                      <div {...cell.getCellProps()} className="data-cell">
                        {cell.render("Cell")}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AudioTableComponent;
