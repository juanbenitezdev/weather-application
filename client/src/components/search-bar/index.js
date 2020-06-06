import React from "react";
import "./style.css";
import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons'

function SearchBarComponent(props) {
  const [cityName, setCityName] = useState("");

  const handleOnClick = (event) => {
    event.preventDefault();
    if (cityName !== "") {
      axios
        .get("http://127.0.0.1:5000/search", { params: { city: cityName } })
        .then((res) => {
          const name = res.data.address;
          props.onSearch(name, res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      setCityName("");
    }
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
      />
      <button className='search-button' onClick={handleOnClick}><FontAwesomeIcon icon={faSearch} /></button>
    </div>
  );
}

export default SearchBarComponent;
