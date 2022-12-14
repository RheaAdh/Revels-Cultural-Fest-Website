import React, { useEffect, useState } from "react";
import axios from "axios";
import Helmet from "react-helmet";
import EventCard from "../../components/EventCard/EventCard";
import Lottie from "lottie-react";
import noEvents from "../../assets/noEvents.json";
import Loader from "../Loader/Loader";
import "./TabSwitch.css";
import "./search.scss"
const Events = ({ isPublic }) => {
  const [events, setEvents] = useState([]);
  const [tab, settab] = useState(0);
  const [isShuffle, setIsShuffle] = useState(true);
  // method to fetch all the events
  const getAllEvents = async () => {
    try {
      const res = await axios.get("/api/user/event/getallevents");
      setEvents(res.data.data.filter((eve) => {return eve.isActive === true}));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllEvents();
  }, []);
  // method to filter the array
  const filterEvents = async (e) => {    
    setIsShuffle(false);
    if(e.target.value === "") {
      getAllEvents();
      setIsShuffle(true);
    }
    // let filteredEventsByCategory = events.filter(
    //   (event) => event.category.category.toLowerCase().includes(e.target.value.toLowerCase())
    // )
    let filteredEventsByName = events.filter(
      (event) => event.name.toLowerCase().includes(e.target.value.toLowerCase())
    )
    // if(filteredEventsByCategory.length !== 0){
    //   setEvents(filteredEventsByCategory)
    // }
    if(filteredEventsByName.length !== 0) {
      setEvents(filteredEventsByName)
    }
  }
  // method to shuffle the events array 
  const shuffleArray = (array) => {
    return array.map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .filter((event)=>{
      return tab === 0 ?  event.eventType === "SPORTS" :  event.eventType === "CULTURAL"
    })
  }
  return (
    <>
      <div className="d-flex flex-md-row flex-column align-items-center">
        <Helmet>
          <title>Events | Aagaz</title>
          <meta name='description' content='Events | Aagaz' />
          <meta name='theme-color' content='#FFFFFF' />
          <meta
            name='keywords'
            content='events, revels, revelsmit, manipal, manipal institute of technology, 2022, sports, cultural, fest, national, aagaz, beginnings'
          />
          <meta name='url' content='https://revelsmit.in/events' />
          <meta name='coverage' content='Worldwide' />
          <meta name='target' content='all' />
          <meta name='HandheldFriendly' content='True' />
          <link rel="canonical" href="https://revelsmit.in/events" />
          {/* OG meta tags */}
          <meta property="og:type" content="webpage" />
          <meta
            property="og:title"
            content="Aagaz | Revels '22"
          />
          <meta
            property="og:description"
            content="Aagaz | Revels '22"
          />
          <meta property="og:image" content='' />
          <meta property="og:url" content='https://revelsmit.in/events' />
          <meta
            property="og:site_name"
            content="Aagaz | Revels '22"
          />
          <meta
            name='twitter:title'
            content="Aagaz | Revels '22"
          />
          <meta
            name="twitter:description"
            content="The official website of Aagaz | Revels '22"
          />
        </Helmet>
        <div class="search-box font-medium">
          <button class="btn-search"><i class="fa fa-search text-white"></i></button>
          <input type="text" class="input-search" onChange={(e) => filterEvents(e)} placeholder="Type to Search..." />
        </div>
        <div className="tabs-wrapper font-medium">
          <div className={tab === 0 ? "taeb-switch left text-center" : "taeb-switch right text-center"}>
            <div className={tab === 0 ? "taeb active font-heavy" : "taeb"} taeb-direction="left" onClick={()=>settab(0)}>
              Sports + Gaming
            </div>
            <div className={tab === 1 ? "taeb active font-heavy" : "taeb"} taeb-direction="right" onClick={()=>settab(1)}>
              Cultural
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: "start",
          flexWrap: 'wrap',
          gap: '10px',
          height: 'fit-content',
        }}
      >
      {events
        ? 
        (isShuffle ? shuffleArray(events).map((eventData, index) => {
            return (
              <EventCard key={index} index={index} data={eventData} isMyEvents={false} isPublic={isPublic} />
            );
          }) :
           
            events.filter((event)=>{
              return tab === 0 ?  event.eventType === "SPORTS" :  event.eventType === "CULTURAL"
            }).map((eventData, index) => {
              return (
                <EventCard key={index} index={index} data={eventData} isMyEvents={false} isPublic={isPublic}/>
              );
            }
          )
      ): <Loader />}
      {events.length === 0 && 
      <div className="py-5 w-md-100 w-50 mx-auto text-center d-flex flex-column justify-content-center align-items-center">
          <Lottie animationData={noEvents} loop/>
          <h3 className="font-heavy" style={{ color: "#c4515c", fontSize: "2rem" }}>NO EVENTS FOUND!</h3>
        </div>}
    </div>
    </>
  );
};

export default Events;
