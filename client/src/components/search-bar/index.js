import React from "react";
import "./style.css";
import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons'

function SearchBarComponent(props) {
  const [cityName, setCityName] = useState("");

  const search = () => {
    if (cityName !== "") {
      axios
        .get("/api/search", { params: { city: cityName } })
        .then((res) => {
          const name = res.data.address;
          props.onSearch(name, res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      setCityName("");
    }
  }

  const _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search();
    }
  }

  const handleOnClick = (event) => {
    event.preventDefault();
    search();
  };

  return (
    <div className='search'>
      <input
        className="search-input"
        placeholder="Search for a city"
        value={cityName}
        onChange={(e) => {
          const text = e.target.value;
          setCityName(text);
        }}
        onKeyDown={_handleKeyDown}
      />
      <button className='search-button' onClick={handleOnClick}><FontAwesomeIcon icon={faSearch} /></button>
    </div>
  );
}

export default SearchBarComponent;
