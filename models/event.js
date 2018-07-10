var mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const connection = require('../model_app').connection;

function add(a, b) {
    return a + b;
}

function num2percent(a) {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const asum = a.reduce(reducer)
  if (asum === 0){
    return a
  }
  var perc = a.map((x)=> x*100.0/asum)
  if (perc.reduce(reducer)>100){
    perc[perc.length-1] = 100 - perc.slice(0,perc.length-1).reduce(reducer)
  }
  return perc
}

const questionsSchema = new Schema([
  {
    "question":String,
    "options":[String],
    "correctOption":Number

  }
])

var eventSchema = new Schema({
  account:{type: Schema.Types.ObjectId, ref: 'User' },
  channel:{ type: Schema.Types.ObjectId, ref: 'Channel' },
  openTokInfo:{
    sessionID:String,
    apiKey:String,
  },
  liveInfo:{
    feedID:String,
    userTime:{type:Number, default:180},
    totalTime:{type:Number, default:3600},
    passedTime:{type:Number, default:600},
    noLike:{type:Number, default:117},
    noViewer:{type:Number, default:321},
    hls:{type:String, default:"http://qthttp.apple.com.edgesuite.net/1010qwoeiuryfg/sl.m3u8"},
    rtmp:{type:String, default:""},
    thumbnail:{type:String, default:"https://gogojets.com/img/video_atl.jpg"}
  },
  tubeinInfo:{
    userTubeinStatus:{type:String, default:"pending"},
    isUserJoined:{type:Boolean, default:false},
    openTokToken:String,
    statusChangeTime:{type:Number, default:1523823404}
  },
  settings:{
    isAutoTimeline:{type:Boolean, default:false},
    isLiveTubeins:{type:Boolean, default:true},
    isDashboardCamera:{type:Boolean, default:true},
    isArchiving:{type:Boolean, default:false}
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
    availableTubeinSpot: {type:[Number], default:[0,0]}, // how much tubeins we have in each block
    tubeins:[
      {
        userID :{type: Schema.Types.ObjectId, ref: 'User'},
        userTubeinStatus : String,
        statusChangeTime:Number
      }
    ], // push Notify all these devices.
    polls:[
      {
        "userID" :{type: Schema.Types.ObjectId, ref: 'User'},
        "userVote" : String //it's not used anymore
      }
    ],
    dateSubmitted:String,
    description:String,
    duration:Number,
    totalTubeinSpot:{type:[Number], default:[0,0]},
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
  cameras:{
      main:{
        type:String, default:"self"
      },
      others:{
        type:[Schema.Types.ObjectId], ref: 'User', default:[]
      }
    },
  isPollSetup: { type: Boolean, default: false },
  isQuestionSetup: { type: Boolean, default: false },
  pollInfo:{
    question:String,
    options:[String],
    votes:{type:[Number], default:[0,0,0,0]},
    votesPercent:{type:[Number], default:[0,0,0,0]},
    isUserVoted:{type:Boolean, default:false},
    startTime:Date,
    endTime:Date,
    questionLogoUrl:String, // save in multitube-tubes-assets/poll.png
    optionLogoUrls:[Boolean], // save in multitube-tubes-assets/poll-option-{x}.png
    optionType:[{type:String, default: ['A','B','C','D']}], //numbers, letters, logos
    draw:String,
    drawFrom:String,
    rewards:[String,Number],
    correctOption:String
  },
  questionInfo:{
       "isSuccess" : Boolean,
        type :String,
        scoreType:String,
        roundType:String,
        roundsNumber:Number,
        questionsNumber:[Number],
        participantNumber:[Number],
        optionNumber:[Number],
        eliminationDescription :[Number],
        timerNumber:[Number],
        scoreNumber:[Number],
        orderToShow :[],
        awardQuantity:Number,
        awardDescription:[String],
        awardDistribution:[String,],
        isTimed:Boolean,
        isLatencyAffected:Boolean,
        isEliminationConsidered:Boolean,

        questionare: [questionsSchema]
  }

},{ collection: 'events' });

eventSchema.pre('save', function(next) {
  if (!this.poll && this.isPollSetup){
    this.eventInfo.polls = []
  }
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
  next();
});



class EventModel {
  hasUserJoined(userID) {

  const flattenedArr = (this.eventInfo.tubeins || []).map(arr => {
    return arr["userID"].toString();
  });

  return flattenedArr.indexOf(userID) > -1
}

hasUserVoted(userID) {
  const flattenedArr = (this.eventInfo.polls || []).map(arr => {
    return arr["userID"].toString();
  });

  return flattenedArr.indexOf(userID) > -1
}
}

const Event = eventSchema.loadClass(EventModel);
module.exports = connection.model("Event", Event);
