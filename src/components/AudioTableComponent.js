import AudioRowComponent from "./AudioRowComponent.js";
import React from "react";
import { useTable } from "react-table";

/*
        <div className="header-row">
          <div className="header-cell">Time Stamp</div>
          <div className="header-cell">Message (incoming)</div>
          <div className="header-cell">Message (outgoing)</div>
          <div className="header-cell">Station Name</div>
          <div className="header-cell">Frequency</div>
          <div className="header-cell">Location</div>
          <div className="header-cell">Pilot</div>
          <div className="header-cell">Audio</div>
        </div>
        {[...data].reverse().map((item, index) => (
          <div
            key={index}
            className={`data-row ${index % 2 === 0 ? "even-row" : "odd-row"}`}
          >
            <div className="data-cell">{item.stamp}</div>
            <div className="data-cell">{item.incoming_message}</div>
            <div className="data-cell">{item.outgoing_message}</div>
            <div className="data-cell">{item.station_name}</div>
            <div className="data-cell">{item.frequency}</div>
            <div className="data-cell">{item.rough_location}</div>
            <div className="data-cell">{item.pilot}</div>
*/

function AudioTableComponent({ data }) {
  // Define columns
  const columns = React.useMemo(
    () => [
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
              const rowClass =
                (data.length - index) % 2 === 0
                  ? "data-row even-row"
                  : "data-row odd-row";

              return (
                <AudioRowComponent
                  key={data[index].url}
                  row={row}
                  rowClass={rowClass}
                  url={data[index].url}
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
