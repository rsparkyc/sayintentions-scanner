import "./App.css";

import React, { useEffect, useState } from "react";

import AudioTableComponent from "./components/AudioTableComponent";
import Autoplayer from "./components/Autoplayer";

const getMessage = async (lastId) => {
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
  const [data, setData] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [lastUrl, setLastUrl] = useState(null);

  const updateLastId = (id) => {
    setLastId(id);
  };

  // Push new data to the end of the array
  const pushData = (newItem) => {
    setData((prevState) => {
      if (prevState.some((item) => item.id === newItem.id)) {
        return prevState; // Return the existing state if item is duplicate
      }
      setLastUrl(newItem.url);
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
  }, [lastId]);

  return (
    <div className="App">
      <div className="autoPlayer">
        {lastUrl && <Autoplayer latestAudioUrl={lastUrl} />}
      </div>
      <main className="data-container">
        <AudioTableComponent data={data} />
      </main>
    </div>
  );
}

export default App;
