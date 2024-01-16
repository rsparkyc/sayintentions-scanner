import "./App.css";

import React, { useEffect, useState } from "react";

const getRealMessage = async (lastId) => {
  const response = await fetch(
    `https://www.sayintentions.ai/listen/next.html?last_id=${lastId}`,
    { credentials: "same-origin" }
  );

  const json = await response.json();
  return json;
};

// eslint-disable-next-line no-unused-vars
const getFakeMessage = async (lastId) => {
  return {
    userid: 0,
    outgoing_message: null,
    stamp: "2024-01-16 07:04:15",
    incoming_message:
      "University traffic commuter 707 Tiger Charlie Tax on a runway 3/5.",
    distance: 20,
    station_name: "University CTAF",
    from_userid: "107",
    multiplayer: 2,
    frequency: "123.075",
    discord_handle:
      '<a target="_new" href="/portal/admin/accounts/edit.html?userid=107">iRacer99</a>',
    id: lastId + 1,
    url: "https://sayintentions.ai/audio/pilot/pilot-5SE9oLY66S6qNs2Moiur.mp3",
    rough_location:
      "On the ground at KEDU (University - Davis, CA) at zero feet.",
    pilot: "Commuter 707TC",
  };
};

function App() {
  const getMessage = getRealMessage;

  const [data, setData] = useState([]);
  const [lastId, setLastId] = useState(0);

  const updateLastId = (id) => {
    console.log("Updating last id to: ", id);
    setLastId(id);
  };

  // Push new data to the end of the array
  const pushData = (newItem) => {
    setData((prevState) => [...prevState, newItem]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const json = await getMessage(lastId);

        if (json.id) {
          updateLastId(json.id);
          pushData(json);
          console.log(json);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    // Call fetchData
    fetchData();

    // Set up a polling interval (e.g., 1000 milliseconds)
    const interval = setInterval(fetchData, 1000);

    // Clear interval on unmount
    return () => clearInterval(interval);
  }, [lastId, getMessage]);

  useEffect(() => {
    console.log("Data has " + data.length + " items");
  }, [data]);

  return (
    <div className="App">
      <main className="data-container">
        <div className="header-row">
          <div className="header-cell">User ID</div>
          <div className="header-cell">Stamp</div>
          <div className="header-cell">Message (incoming)</div>
          <div className="header-cell">Message (outgoing)</div>
          <div className="header-cell">Station Name</div>
          <div className="header-cell">Frequency</div>
          <div className="header-cell">Location</div>
          <div className="header-cell">Distance</div>
          <div className="header-cell">Pilot</div>
          <div className="header-cell">Audio</div>
        </div>
        {data.map((item, index) => (
          <div key={index} className="data-row">
            <div className="data-cell">{item.from_userid}</div>
            <div className="data-cell">{item.stamp}</div>
            <div className="data-cell">{item.incoming_message}</div>
            <div className="data-cell">{item.outgoing_message}</div>
            <div className="data-cell">{item.station_name}</div>
            <div className="data-cell">{item.frequency}</div>
            <div className="data-cell">{item.rough_location}</div>
            <div className="data-cell">{item.distance}</div>
            <div className="data-cell">{item.pilot}</div>
            <div className="data-cell">
              {item.url && (
                <audio controls preload="none">
                  <source src={item.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
