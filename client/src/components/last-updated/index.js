import React from 'react'
import "./style.css";
import momentTimezone from 'moment-timezone'

const userTimezone = momentTimezone.tz.guess(true);

function LastUpdatedComponent(props) {
    const date = momentTimezone.utc(props.data.last_updated).tz(userTimezone);
    const last_updated = date.format('DD-MM-YYYY HH:mm:ss')
    return <p className='last-updated'>Last updated: {last_updated}</p>;
}

export default LastUpdatedComponent;