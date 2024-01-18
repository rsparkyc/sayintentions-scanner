import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import React, { useCallback, useEffect, useState } from "react";

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
  const showFilterControls = searchParams.has("filters");

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

  const updateLastId = (id) => {
    setLastId(id);
  };
  const handleFieldChange = (event) => {
    setNewFilter({ ...newFilter, field: event.target.value });
  };

  const handleValueChange = (event) => {
    setNewFilter({ ...newFilter, value: event.target.value });
  };

  const handleAddFilter = (filterType) => {
    let filterToAdd = { ...newFilter, type: filterType };
    addFilter(filterToAdd);
    setNewFilter({ field: filterableFields[0], value: "", type: "include" }); // Reset form
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

  const addFilter = useCallback(
    (newFilter) => {
      console.log("Current filters: ", filters);
      debugger;
      if (
        newFilter.field !== "" &&
        newFilter.value !== "" &&
        newFilter.type !== ""
      ) {
        console.log("Adding filter: ", newFilter);
        setFilters([...filters, newFilter]);
      }
    },
    [filters]
  );

  const removeFilter = (index) => {
    console.log("Current filters: ", filters);
    console.log("Removing filter at index: ", index);
    setFilters(filters.filter((_, i) => i !== index));
  };

  useEffect(() => {
    console.log("Filters now set to: ", filters);
  }, [filters]);

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

    // Push new data to the end of the array
    const pushData = (newItem) => {
      setData((prevState) => {
        if (prevState.some((item) => item.id === newItem.id)) {
          return prevState; // Return the existing state if item is duplicate
        }
        const passesFilters = filters.every((filter) => {
          if (filter.type === "include") {
            return newItem[filter.field].includes(filter.value);
          } else {
            return !newItem[filter.field].includes(filter.value);
          }
        });
        if (passesFilters) {
          setLastUrl(newItem.url);
        }
        return [newItem, ...prevState]; // Add item at the beginning if not a duplicate
      });
    };

    // Call fetchData
    fetchData();

    // Set up a polling interval (e.g., 1000 milliseconds)
    const interval = setInterval(fetchData, 1000);

    // Clear interval on unmount
    return () => clearInterval(interval);
  }, [filters, lastId]);

  return (
    <div className="App">
      <div className="autoPlayer">
        {lastUrl && <Autoplayer latestAudioUrl={lastUrl} />}
      </div>
      {showFilterControls && (
        <form>
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
          {/* Include Filter Button */}
          <button type="button" onClick={() => handleAddFilter("include")}>
            <i className="fa fa-filter" aria-hidden="true"></i>
          </button>
          {/* Exclude Filter Button */}
          <button type="button" onClick={() => handleAddFilter("exclude")}>
            <i className="fa fa-filter-circle-xmark" aria-hidden="true"></i>
          </button>
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
        <AudioTableComponent
          data={filteredData}
          filterableFields={filterableFields}
          addFilter={addFilter}
          allowFiltering={showFilterControls}
        />
      </main>
    </div>
  );
}

export default App;
