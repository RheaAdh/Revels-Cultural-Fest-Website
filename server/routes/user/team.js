const Team = require('../../models/Team');
const Event = require('../../models/Event');
const { nanoid } = require('nanoid');
const User = require('../../models/User');

const joinTeam = async (req, res) => {
  try {
    const user = req.requestUser;
    const { eventID, teamID } = req.body;
    let event = await Event.findOne(
      { eventID },
      {
        delegateCards: 1,
        isActive: 1,
        registrationDeadline: 1,
        teamDelegateCard: 1,
        maxMembers: 1,
      }
    );
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    //User is not registered for the event
    let team = await Team.findOne(
      { eventID, 'members.user': user._id },
      { teamID: 1 }
    );

    let newTeam = await Team.findOne({ eventID, teamID });

    // Invalid Team Code
    if (!newTeam)
      return res
        .status(400)
        .send({ success: false, msg: 'Request Team Code Invalid' });

    if (team && teamID == team.teamID)
      return res.status(400).send({ success: false, msg: 'Already in team' });

    if (team)
      return res.status(400).send({
        success: false,
        msg: 'User Already Registered !!',
      });

    console.log(event);
    // Team Size Full
    if (event.maxMembers == newTeam.members.length)
      return res.status(400).send({ success: false, msg: 'Team is full' });

    if (!event.teamDelegateCard) {
      // Check on delegate cards
      event.delegateCards.forEach((delCard) => {
        if (user.delegateCards.indexOf(delCard) == -1) {
          return res.status(400).send({
            success: false,
            msg: 'Please buy event specific delegate card(s)',
          });
        }
      });
    }

    // console.log("team details");
    // console.log(team.members.length);
    // console.log(team.members);
    // console.log(user._id);
    // if (
    //   team.members.length == 1 &&
    //   String(team.members[0]) == String(user._id)
    // ) {
    //   // Delete Team - when user is only member in team
    //   console.log("Delete");
    //   await Team.findByIdAndDelete(team._id);
    // } else {
    //   //Remove From Existing Team
    //   console.log("Team ", team.teamID);
    //   console.log("User ", user._id);
    //   await Team.updateOne(
    //     { teamID: team.teamID },
    //     { $pull: { members: user._id } }
    //   );
    // }

    //Register To new Team
    // await Team.updateOne(
    //   { teamID: newTeam.teamID },
    //   { $push: { members: user._id } }
    // );
    // newTeam.members.push(user._id);
    // await newTeam.save();

    //Sending Team Request
    team = await Team.findOneAndUpdate(
      {
        // eventID,
        teamID,
      },
      {
        $addToSet: { requestedMembers: user._id },
      },
      { new: true }
    );
    //TODO: Send Mail

    return res.status(200).send({
      success: true,
      msg: 'Request to Join team sent',
      data: team,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, msg: 'Internal Server Error' });
  }
};

const addToTeam = async (req, res) => {
  try {
    const user = req.requestUser;

    const { eventID, teamID, userID } = req.body;

    const member = await User.findOne({ userID }, { userID: 1 });
    if (!member) {
      return res
        .status(400)
        .send({ success: false, msg: 'User does not exist' });
    }

    let event = await Event.findOne(
      { eventID },
      {
        delegateCards: 1,
        isActive: 1,
        registrationDeadline: 1,
        teamDelegateCard: 1,
        maxMembers: 1,
      }
    );
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    let team = await Team.findOne(
      { eventID, 'members.user': member._id },
      { teamID: 1 }
    );

    let newTeam = await Team.findOne({ eventID, teamID });

    //User is not registered for the event
    if (!newTeam)
      return res.status(400).send({ success: false, msg: 'Team Code Invalid' });

    if (team && teamID == team.teamID)
      return res.status(400).send({ success: false, msg: 'Already in team' });

    if (team)
      return res.status(400).send({
        success: false,
        msg: 'User Already Registered !!',
      });

    // Team Size Full
    if (event.maxMembers == newTeam.members.length)
      return res
        .status(400)
        .send({ success: false, msg: 'Request Team is full' });

    if (newTeam.createdBy.toString() != user._id.toString())
      return res.status(400).send({ success: false, msg: 'Access Denied' });
    if (!event.teamDelegateCard) {
      // Check on delegate cards
      event.delegateCards.forEach((delCard) => {
        if (user.delegateCards.indexOf(delCard) == -1) {
          return res.status(400).send({
            success: false,
            msg: 'Event specific delegate card(s) missing. Cannot add user.',
          });
        }
      });
    }

    // console.log("team details");
    // console.log(team.members.length);
    // console.log(team.members);
    // console.log(user._id);
    // if (
    //   team.members.length == 1 &&
    //   String(team.members[0]) == String(user._id)
    // ) {
    //   // Delete Team - when user is only member in team
    //   console.log("Delete");
    //   await Team.findByIdAndDelete(team._id);
    // } else {
    //   //Remove From Existing Team
    //   console.log("Team ", team.teamID);
    //   console.log("User ", user._id);
    //   await Team.updateOne(
    //     { teamID: team.teamID },
    //     { $pull: { members: user._id } }
    //   );
    // }

    //Add To Team
    team = await Team.findOneAndUpdate(
      { teamID: teamID },
      {
        $addToSet: {
          members: {
            user: member._id,
            attendance: [{ roundNumber: 1, isPresent: false }],
          },
        },
        $pull: { requestedMembers: member._id },
      },
      { new: true }
    );

    //Final Team
    // team = await Team.findOne({ eventID, "members.user": { $in: user._id } });

    return res
      .status(200)
      .send({ success: true, msg: 'User Added to Team', data: team });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, msg: 'Internal Server Error' });
  }
};

const leaveTeam = async (req, res) => {
  try {
    let { teamID } = req.body;
    let user = req.requestUser;
    const team = await Team.findOne({ teamID, 'members.user': user._id });
    console.log(user._id, team);
    if (!team)
      return res.status(404).json({ msg: 'Unable to leave the team.' });
    if (team.createdBy.toString() == user._id.toString()) {
      await Team.deleteOne({ teamID });
      return res
        .status(200)
        .send({ success: true, data: team, msg: 'Team Deleted' });
    }
    await Team.findOneAndUpdate(
      { teamID: teamID },
      { $pull: { members: { user: user._id } } },
      { new: true }
    );
    return res
      .status(200)
      .send({ success: true, data: team, msg: 'Team Left' });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, msg: 'Internal Server Error' });
  }
};
const removeFromTeam = async (req, res) => {
  try {
    let { teamID, userID } = req.body;

    const member = await User.findOne({ userID }, { userID: 1 });
    let user = req.requestUser;
    let team = await Team.findOne({ teamID, 'members.user': member._id });
    if (!team) return res.status(404).json({ msg: 'Team not found' });
    console.log(team.createdBy.toString(), user._id.toString());
    if (team.createdBy.toString() != user._id.toString()) {
      return res
        .status(200)
        .send({ success: true, data: team, msg: 'Cannot Remove' });
    }
    team = await Team.findOneAndUpdate(
      { teamID: teamID },
      { $pull: { members: { user: member._id } } },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      data: team,
      msg: 'User removed from the team',
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, msg: 'Internal Server Error' });
  }
};

<<<<<<< Updated upstream
const getEventTeam = async (req, res) => {
  try {
    // $and:[{},
    let { event_ID } = req.body;
    let team = await Team.findOne({
      event: event_ID,
      'members.user': req.requestUser._id,
    });
=======
const getTeamByID = async (req, res) => {
  try {
    let { teamID } = req.body;
    let team = await Team.findOne({ teamID });
>>>>>>> Stashed changes
    if (!team)
      return res.status(400).send({ success: false, msg: 'Invalid Team' });
    return res.status(200).send({ success: false, data: team });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ msg: 'Internal Server Error', success: false });
  }
};

module.exports = {
  addToTeam,
  joinTeam,
  leaveTeam,
  removeFromTeam,
<<<<<<< Updated upstream
  getEventTeam,
=======
  getTeamByID,
>>>>>>> Stashed changes
};

//edge cases
//user getting added into team multiple times
//if no user in team deleete team(done)
