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
  const searchParams = new URLSearchParams(window.location.search);
  let showFilterControls = searchParams.has("filters");

  const [data, setData] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [lastUrl, setLastUrl] = useState(null);
  const [filters, setFilters] = useState([]);

  const filterableFields = ["airport", "frequency", "pilot"];

  const [newFilter, setNewFilter] = useState({
    field: filterableFields[0],
    value: "",
    type: "include",
  });

  const handleFieldChange = (event) => {
    setNewFilter({ ...newFilter, field: event.target.value });
  };

  const handleValueChange = (event) => {
    setNewFilter({ ...newFilter, value: event.target.value });
  };

  const handleTypeChange = (event) => {
    setNewFilter({ ...newFilter, type: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addFilter(newFilter);
    setNewFilter({ field: filterableFields[0], value: "", type: "include" }); // Reset form
  };

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

  const applyFilters = (data) => {
    return data.filter((item) => {
      return filters.every((filter) => {
        if (filter.type === "include") {
          return item[filter.field].includes(filter.value);
        } else {
          return !item[filter.field].includes(filter.value);
        }
      });
    });
  };

  const addFilter = (newFilter) => {
    if (
      newFilter.field !== "" &&
      newFilter.value !== "" &&
      newFilter.type !== ""
    ) {
      setFilters([...filters, newFilter]);
    }
  };

  const removeFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const filteredData = applyFilters(data);

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
      {showFilterControls && (
        <form onSubmit={handleSubmit}>
          <select value={newFilter.field} onChange={handleFieldChange}>
            {filterableFields.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newFilter.value}
            onChange={handleValueChange}
          />
          <select value={newFilter.type} onChange={handleTypeChange}>
            <option value="include">Include</option>
            <option value="exclude">Exclude</option>
          </select>
          <button type="submit">Add Filter</button>
        </form>
      )}
      <div className="active-filters">
        {filters.map((filter, index) => (
          <div key={index}>
            {filter.field}: {filter.value} ({filter.type})
            <button onClick={() => removeFilter(index)}>Remove</button>
          </div>
        ))}
      </div>
      <main className="data-container">
        <AudioTableComponent data={filteredData} />
      </main>
    </div>
  );
}

export default App;
