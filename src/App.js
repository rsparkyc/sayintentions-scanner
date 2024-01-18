import "./App.css";

import React, { useEffect, useState } from "react";

import AudioTableComponent from "./components/AudioTableComponent";

const getRealMessage = async (lastId) => {
  let options = {};

  // if we are not under the sayintentions.ai domain,
  // we should set the credentials to "same-origin"
  if (window.location.hostname.endsWith("sayintentions.ai")) {
    options = {
      credentials: "same-origin",
    };
  }

  const response = await fetch(
    `https://www.sayintentions.ai/api/scanner.html?last_id=${lastId}`,
    options
  );

  const json = await response.json();
  return json;
};

function App() {
  const getMessage = getRealMessage;

  const [data, setData] = useState([]);
  const [lastId, setLastId] = useState(0);

  const updateLastId = (id) => {
    setLastId(id);
  };

  // Push new data to the end of the array
  const pushData = (newItem) => {
    setData((prevState) => {
      if (prevState.some((item) => item.id === newItem.id)) {
        return prevState; // Return the existing state if item is duplicate
      }
      return [newItem, ...prevState]; // Add item at the beginning if not a duplicate
    });
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

  return (
    <div className="App">
      <main className="data-container">
        <AudioTableComponent data={data} />
      </main>
    </div>
  );
}

export default App;
