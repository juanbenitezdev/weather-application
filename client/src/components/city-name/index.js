import React from "react";
import "./style.css";

function CityNameComponent(props) {
  return <h3 className='city-name'>{props.data.address}</h3>;
}

export default CityNameComponent;
