import React from "react";
import "./style.css";

function TemperatureComponent(props) {
  return <p className='temperature'>{props.data.temperature} °C</p>;
}

export default TemperatureComponent;