/*
  As an authenticated user:
  - I can keep my polls and come back later to access them
  - I can share my polls with my friends;
  - I can see the aggregate result of my polls
  - I can delete polls that I decide I don't want anymore
  - I can create a poll with any number of possible items

  As an un-authenticated user:
  - I can see and vote on everyone' polls;
  I can see the result of polls in chart form (This could be implemented using Chart.js or Google Charts.)

*/
var mongoose = require('mongoose');

var PollSchema = mongoose.Schema({
  createdBy: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  title: String,
  answer: [{
    title: String,
    number: Number
  }],
  // ip: [{
  //   address: String,
  //   voted: {
  //     type: Boolean,
  //     default: false
  //   }
  // }],
  voteBy: [{
    userID: String,
    isVoted: Boolean
  }]
});

var Poll = module.exports = mongoose.model('poll', PollSchema)