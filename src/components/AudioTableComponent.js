import AudioRowComponent from "./AudioRowComponent.js";
import React from "react";
import { useTable } from "react-table";

function AudioTableComponent({ data }) {
  // Define columns
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Time Stamp",
        accessor: "stamp",
      },
      {
        Header: "Message (incoming)",
        accessor: "incoming_message",
      },
      {
        Header: "Message (outgoing)",
        accessor: "outgoing_message",
      },
      {
        Header: "Airport",
        accessor: "airport",
      },
      {
        Header: "Station Name",
        accessor: "station_name",
      },
      {
        Header: "Frequency",
        accessor: "frequency",
      },
      {
        Header: "Location",
        accessor: "rough_location",
      },
      {
        Header: "Pilot",
        accessor: "pilot",
        Cell: ({ row, value }) => {
          let title = "";
          if (row.original.multiplayer !== 2) {
            title = "Non-multiplayer user";
          }

          return (
            value && (
              <>
                <div class="pilot-name" title={title}>
                  {value}
                </div>
                <div class="demo-flag">Demo User</div>
              </>
            )
          );
        },
      },
      {
        Header: "Audio",
        accessor: "url",
        Cell: ({ value }) =>
          value && (
            <>
              <audio key={value} controls preload="none">
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
          <div {...getTableBodyProps()} className="data-row-group">
            {rows.map((row, index) => {
              prepareRow(row);
              let rowClass =
                (data.length - index) % 2 === 0
                  ? "data-row even-row"
                  : "data-row odd-row";

              if (data[index].demo === 1) {
                rowClass += " demo-user";
              }
              if (data[index].multiplayer !== 2) {
                rowClass += " non-multiplayer";
              }
              return (
                <AudioRowComponent
                  key={data[index].id}
                  row={row}
                  rowClass={rowClass}
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AudioTableComponent;
