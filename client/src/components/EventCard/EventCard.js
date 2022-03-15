import React from "react";
import "./EventCard.scss";

const EventCard = ({ data }) => {
    return (
        <div className="event-card-wrapper">
            <div className="event-content">
                <div className="event-header">
                    <div className="event-area">
                        <p className="font-heavy">CATEGORY NAME</p>
                        <h3 className="font-light">{data.name}</h3>
                    </div>
                    <div className="button-area">
                        <button className="font-heavy">{data.mode === "OFFLINE" ? "Offline" : "Online"} Event</button>
                        <button className="font-medium">Register</button>
                    </div>
                </div>
                <div className="tags-line">
                    {
                        data.tags.map((val, index) => {
                            return (
                                <p key={index} className="font-light">
                                    {val} 
                                    {index !== data.tags.length ? " ◦" : ""} 
                                </p>
                            )
                        })
                    }
                </div>
                <div className="description font-medium">
                    {data.description}
                </div>
                <div className="data-area">
                    {
                        data.maxMembers > 1 
                        ?
                        <div className="box">
                            <p className="font-heavy">TEAM SIZE</p>
                            <h3 className="font-light">{data.minMembers} - {data.maxMembers}</h3>
                        </div>
                        :
                        <div className="box">
                            <p className="font-heavy">TEAM SIZE</p>
                            <h3 className="font-light">Individual Event</h3>
                        </div>                        
                    }
                    <div className="box">
                        <p className="font-heavy">DATE</p>
                        <h3 className="font-light">{new Date(data.eventDateTime).getDate()}-{new Date(data.eventDateTime).getUTCMonth()}</h3>
                    </div>
                    <div className="box">
                        <p className="font-heavy">VENUE</p>
                        <h3 className="font-light">{data.eventVenue}</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventCard;