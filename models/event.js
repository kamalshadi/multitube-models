var mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const connection = require('../app').connection;

function add(a, b) {
    return a + b;
}

var eventSchema = new Schema({
  account:{type: Schema.Types.ObjectId, ref: 'User' },
  channel:{ type: Schema.Types.ObjectId, ref: 'Channel' },
  openTokInfo:{
    sessionID:String,
    apiKey:String,
  },
  liveInfo:{
    feedID:String,
    noLike:Number,
    noViewer:Number,
    thumbnail:String
  },
  tubeinInfo:{
    userTubeinStatus:{type:String, default:"pending"},
    isUserJoined:{type:Boolean, default:false},
    openTokToken:String
  },


  notifications:{ // notification settings and status for the event moderator
    email:{
      permit:{type:Boolean,default:true},
      sent:{type:Boolean,default:false}
    },
    sms:{
      permit:{type:Boolean,default:true},
      sent:{type:Boolean,default:false}
    },
    push:{
      permit:{type:Boolean,default:true},
      sent:{type:Boolean,default:false}
    }
  },
  tubeStatus : {type:String, default:"offair"},
  eventInfo: {
    startingThumbnail:String,
    endingThumbnail:String,
    tweetText:String,
    invitees:[String],
    airTimeAvailable: {type:[Number], default:[0,0]}, // how much airtime is available for each tubeins
    availableTubeinSpot: [Number], // how much tubeins we have in each block
    tubeins:[
      {
        userID :{type: Schema.Types.ObjectId, ref: 'User'},
        userTubeinStatus : String
      }
    ], // push Notify all these devices.
    dateSubmitted:String,
    description:String,
    duration:Number,
    totalTubeinSpot:[Number],
    geo: { // google geolocation info
      latitude:Number,
      longitude:Number,
      city: String,
      country:String,
      state:String
    },
    tubeinBlocks:[{"blockStarts":Number,"blockEnds":Number,"NTubeins":Number}],
    screenSizeAvailable:{type:[String],default:['one-half','one-half']},
    startTime: Number,
    tags: [String], // all the tags
    title: String,
    eventType:String,
    tubeinAdPrice: {type:[Number], default:[0,0]},
    tubeinPrice: {type:[Number], default:[0,0]},
    created_at:  { type: Date, default: Date.now },
    updated_at:  { type: Date, default: Date.now }
  },
  isPollSetup: { type: Boolean, default: false },
  pollInfo:{
    question:String,
    options:[String],
    votes:{type:[Number], default:[0,0,0,0]},
    isUserVoted:Boolean,
    startTime:Date,
    endTime:Date,
    questionLogoUrl:String, // save in multitube-tubes-assets/poll.png
    optionLogoUrls:[Boolean], // save in multitube-tubes-assets/poll-option-{x}.png
    optionType:[{type:String, default: ['A','B','C','D']}], //numbers, letters, logos
    draw:String,
    drawFrom:String,
    rewards:[String,Number],
    correctOption:String
  }
},{ collection: 'events' });

eventSchema.pre('save', function(next) {
  console.log('inside event')
  this.updated_at = new Date();
  if (this.eventInfo.airTimeAvailable.reduce(add) == 0){ // initial condition
    this.eventInfo.airTimeAvailable = [0,0];
    var tmp = 0;
    if (this.eventInfo.tubeinBlocks[0].NTubeins == 0){
      tmp = this.eventInfo.tubeinBlocks[0].blockEnds - this.eventInfo.tubeinBlocks[0];
    }
    else{
    tmp = (this.eventInfo.tubeinBlocks[0].blockEnds - this.eventInfo.tubeinBlocks[0].blockStarts)/this.eventInfo.tubeinBlocks[0].NTubeins;
    }
    this.eventInfo.totalTubeinSpot = []
    this.eventInfo.availableTubeinSpot = []
    this.eventInfo.totalTubeinSpot.push(this.eventInfo.tubeinBlocks[0].NTubeins)
    this.eventInfo.availableTubeinSpot.push(this.eventInfo.tubeinBlocks[0].NTubeins)
    this.eventInfo.airTimeAvailable[0] = Math.ceil(tmp);
    if(this.eventInfo.tubeinBlocks.length == 2){
      var tmp = 0;
        if (this.eventInfo.tubeinBlocks[1].NTubeins == 0){
          tmp = this.eventInfo.tubeinBlocks[1].blockEnds - this.eventInfo.tubeinBlocks[1];
        }
        else{
        tmp = (this.eventInfo.tubeinBlocks[1].blockEnds - this.eventInfo.tubeinBlocks[1].blockStarts)/this.eventInfo.tubeinBlocks[1].NTubeins;
      }
      this.eventInfo.airTimeAvailable[1] = Math.ceil(tmp);
      this.eventInfo.totalTubeinSpot.push(this.eventInfo.tubeinBlocks[1].NTubeins)
      this.eventInfo.availableTubeinSpot.push(this.eventInfo.tubeinBlocks[1].NTubeins)
    }
    else{
      this.eventInfo.totalTubeinSpot.push(0)
      this.eventInfo.availableTubeinSpot.push(0)
    }
    }
    console.log('coming out')
  next();
});

class EventModel {

  hasUserJoined(userID) {
    const flattenedArr = (this.eventInfo.tubeins || []).map(arr => {
      return arr["userID"].toString();
    });
    return flattenedArr.indexOf(userID) > -1
  }
}

const Event = eventSchema.loadClass(EventModel);
module.exports = connection.model("Event", Event);
