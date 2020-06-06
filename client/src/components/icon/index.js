import React from "react";
import "./style.css";

function IconComponent(props) {
  const url = "http://openweathermap.org/img/wn/" + props.data.icon + "@2x.png";
  return <img className='icon' src={url} alt="Icon" />;
}

export default IconComponent;
