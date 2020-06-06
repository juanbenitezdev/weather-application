import React from 'react'
import "./style.css";
import CityNameComponent from "../city-name";
import TemperatureComponent from "../temperature";
import IconComponent from "../icon";
import SummaryComponent from "../summary";
import LastUpdatedComponent from "../last-updated";


function WeatherDataComponent(props) {
    
    
    return (
        <div className={`data-container ${Object.keys(props.data).length !== 0 ? "visible" : "hidden"}`} >
            <CityNameComponent data={props.data}></CityNameComponent>
            <div className='temperature-info'>
                <IconComponent data={props.data}></IconComponent>
                <TemperatureComponent data={props.data}></TemperatureComponent> 
            </div>
            <div>
                <SummaryComponent data={props.data}></SummaryComponent>
            </div>
            <div className='last-updated'>
                <LastUpdatedComponent data={props.data}></LastUpdatedComponent>
            </div>    
        </div>
    )
}

export default WeatherDataComponent;