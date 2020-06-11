import React from "react";
import "./style.css";

function IconComponent(props) {
  const url = props.data.icon;
  return Object.keys(props.data).length !== undefined ? <img className='icon' src={url} alt="Icon" /> : null;
}

export default IconComponent;
