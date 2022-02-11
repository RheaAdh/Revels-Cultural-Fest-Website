const User = require('../../models/User');
const Event = require('../../models/Event');
const { getUserFromToken } = require('../userRoutes/user');

const registerEvent = async (req, res) => {
    try {
        let { eventID } = req.body;
        let event = await Event.findOne({ eventID });

        if (event.length == 0)
            return res
                .status(400)
                .send({ success: false, msg: 'No Events Found' });

        let user = req.requestUser;
        if (user.regEvents.indexOf(event._id) !== -1)
            return res
                .status(400)
                .send({ success: false, msg: 'Event is already registered' });

        user.regEvents.push(event._id);
        await user.save();
        event.participants.push(user._id);
        await event.save();
        console.log('Registered New Event');
        return res
            .status(200)
            .send({ success: true, msg: 'Event Registered Successfully' });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, msg: 'Internal Server Error' });
    }
};

const getUserEvents = async (req, res) => {
    try {
        let user = req.requestUser;
        let events = await Event.find({ participants: user._id });
        return res.status(200).send({ success: true, data: events });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, msg: 'Internal Server Error' });
    }
};

module.exports = { registerEvent, getUserEvents };
