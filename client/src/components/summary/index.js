import React from 'react'
import "./style.css";


function SummaryComponent(props) {
    return <p className='summary'>{props.data.summary}</p>;
}

export default SummaryComponent;