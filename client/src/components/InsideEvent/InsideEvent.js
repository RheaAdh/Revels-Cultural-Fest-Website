import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { TOKEN_ID } from '../../utils/constants';
import { useParams } from 'react-router-dom';
import Layout from '../../pages/Layout/Layout';
import Modal from 'react-modal';
import axios from 'axios';
import moment from 'moment';
import './InsideEvent.scss';
import { useAuth } from '../../context/AuthContext';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const InsideEvent = () => {
  const auth = useAuth();
  const header = {
    authorization: localStorage.getItem(TOKEN_ID),
  };
  const { eventid } = useParams();
  const [eventID, setEventID] = useState(eventid);
  const [event, setEvent] = React.useState({});
  const [team, setTeam] = useState([]);
  const [teamIDInput, setTeamIDInput] = useState('');

  //MODAL STUFF
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }
  function closeModal() {
    setIsOpen(false);
  }

  const formatDate = (str) => {
    // var str = '2011-04-11T10:20:30Z';
    var date = moment(str);
    var dateComponent = date.utc().format('DD-MM-YY');
    var timeComponent = date.utc().format('HH:mm');
    return dateComponent + ' , ' + timeComponent;
  };

  const callEventByID = async () => {
    try {
      const res = await axios.post(
        '/api/user/event/getbyid',
        { event_Id: eventID },
        { headers: header }
      );
      console.log('event now');
      console.log(res.data.data);
      setEvent(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getTeamDetails = async () => {
    try {
      const res = await axios.post(
        '/api/user/team/get',
        { eventID: eventID },
        { headers: header }
      );
      setTeam(res.data.data);
      console.log(team, res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTeamDetails();
    callEventByID();
  }, []);

  const createTeam = () => {
    console.log('!');
  };

  const joinTeam = async () => {
    try {
      const res = await axios.post(
        '/api/user/team/join',
        { eventID: event.eventID, teamID: teamIDInput },
        { headers: header }
      );
      console.log('ress1', res);
      if (res.data.success) {
        toast.success(res.msg, { position: 'bottom-center' });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const registerIndividual = async () => {
    try {
      const res = await axios.post(
        '/api/user/event/register',
        { eventID: event.eventID },
        { headers: header }
      );
      console.log('ress2', res);
    } catch (err) {
      console.log(err);
    }
  };
  const leaveTeam = async () => {};
  return (
    <Layout activeTab={'events'}>
      <div className="event-details">
        <div className="ele">
          <p className="font-heavy">{event.eventType}</p>
          <p className="font-light">{event.name}</p>
        </div>
        <div className="event-grp ele">
          <div className="compo">
            <p className="font-heavy">Team Size</p>
            <p className="font-light">
              {event.minMembers}&nbsp;-&nbsp;{event.maxMembers}
            </p>
          </div>
          <div className="compo">
            <p className="font-heavy">Event Date</p>
            <p className="font-light">
              {new Date(event.eventDateTime).getDate()}&nbsp;/&nbsp;
              {new Date(event.eventDateTime).getMonth()}
            </p>
          </div>
          <div className="compo ">
            <p className="font-heavy">Venue</p>
            <p className="font-light">{event.eventVenue}</p>
          </div>
          <div className="compo ">
            <p className="font-heavy">Registration Deadline</p>
            <p className="font-light">
              {new Date(event.registrationDeadline).getDate()}&nbsp;/&nbsp;
              {new Date(event.registrationDeadline).getMonth()}
            </p>
          </div>
        </div>
        <div className="ele font-light">{event.description}</div>

        {/* POPUP FOR REGISTER */}
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <button
            onClick={closeModal}
            style={{
              color: 'red',
              textDecoration: 'none',
              padding: '0.5rem',
              border: 'none',
              borderRadius: '0.5rem',
            }}
          >
            X
          </button>
          <h2
            ref={(_subtitle) => (subtitle = _subtitle)}
            style={{ textAlign: 'center', margin: '1rem' }}
            className="font-heavy blueinwhite"
          >
            Registration Type
          </h2>
          {event.maxMembers === 1 ? (
            <button
              className="font-heavy blueinwhite"
              onClick={registerIndividual}
            >
              Join Individually
            </button>
          ) : (
            <div className="btn-grp">
              <button
                className="font-heavy blueinwhite"
                onClick={registerIndividual}
              >
                Join Individually
              </button>
              <hr />
              OR
              <hr />
              <input
                type="text"
                onChange={(e) => {
                  setTeamIDInput(e.target.value);
                }}
                style={{ color: 'black' }}
                placeholder="Team ID"
              />
              <button className="font-heavy blackingrey" onClick={joinTeam}>
                Join Team
              </button>
            </div>
          )}
        </Modal>
        {/* IF IN TEAM */}
        {team === null ? (
          <div>
            <button onClick={openModal} className="font-heavy blackingrey">
              Register
            </button>
          </div>
        ) : (
          <div>
            <div className="ele">
              <div className="font-heavy">Team Members</div>
              <div className="split">
                <div>Rhea Adhikari</div>
              </div>
            </div>
            <div className="ele">
              <div className="font-heavy">Team ID</div>
              <div className="split">
                <div>1223</div>
                <button className="font-heavy blueinwhite" onClick={leaveTeam}>
                  Leave Team
                </button>
              </div>
            </div>
            {/* IF CREATOR*/}

            {/* <div className="ele">
              <div className="font-heavy">Add to team</div>
              <div className="split">
                <input
                  type="text"
                  placeholder="Enter Delegate ID"
                  className="input-team"
                ></input>
                <button className="font-heavy whiteinblue">Invite</button>
              </div>
            </div> */}

            <div className="ele">
              <div className="font-heavy">REQUESTS</div>
              <div>
                xyz<button>Allow</button>
                <button>REJECT</button>
              </div>
              <div>
                xyz<button>Allow</button>
                <button>REJECT</button>
              </div>
              <div>
                xyz<button>Allow</button>
                <button>REJECT</button>
              </div>
            </div>
          </div>
        )}
        {/* <div className="ele">
          <div className="font-heavy">Join Team</div>
          <div className="split">
            <input
              type="text"
              placeholder="Enter Team Code"
              className="input-team"
            ></input>
            <button className="font-heavy blueinwhite">Join</button>
            <button className="font-heavy blackingrey">Cancel</button>
          </div>
        </div> */}
      </div>
    </Layout>
  );
};

export default InsideEvent;
