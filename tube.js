var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var tubeSchema = new Schema({
  "account":{
    "fullName":String,
    "email":String,
    "phoneNumber":String,
    "address":{},
    "selectedCountry":String,
    "_id": { type: Schema.Types.ObjectId, ref: 'User' },
    "membership": String // type of membership on MT
  },
  "openTokInfo":{
    "sessionID":String,
    "apiKey":String,
  },
  "tubeID":{type:String, index:true },
  "liveInfo":{
    "feedID":String,
    "noLike":Number,
    "noViewer":Number,
    "thumbnail":String
  },
  "tubeinInfo":{
    "userTubeinStatus":{type:String,default:"pending"},
    "isUserJoined":{type:Boolean,default:false},
    "openTokToken":String
  },
  "channel": {
      "_id":{ type: Schema.Types.ObjectId, ref: 'Channel' },
      "image": String,
      "name": String,
      "promoImage": String,
      "channelType": String,
      "description":String,
      "rtmp":String,
      "settings": {
        "preferredLayouts": [String], // Enforce three elements
        "maxMinutes": Number, // maximum minutes of collaboration
        "minMinutes": Number, // minimum price
        "minPrice": Number, // min price per unit per time for collaboration
        "maxPrice": Number, // max price per unit per time for collaboration
      },
      "stats":{
        "averageView":Number,
        "totalVideo":Number,
        "totalLiveEvents":Number,
        "numberOfSubscribers":Number
      }
  },
  "notifications":{ // notification settings and status for the event moderator
    "email":{
      "permit":Boolean,
      "sent":Boolean
    },
    "sms":{
      "permit":Boolean,
      "sent":Boolean
    },
    "push":{
      "permit":Boolean,
      "sent":Boolean
    }
  },
  "tubeStatus" : {type:String, default:"offair"},
  "eventInfo": {
    "startingThumbnail":String,
    "endingThumbnail":String,
    "status":String, //live,past,upcoming,soon,late
    "tweetText":String,
    "invitees":[String],
    "airTimeAvailable": [Number], // how much airtime is available for each tubeins
    "availableTubeinSpot": [Number], // how much tubeins we have in each block
    "tubeins":[
      {
        "userID" :{type: Schema.Types.ObjectId, ref: 'User'},
        "userTubeinStatus" : String //it's not used anymore
      }
    ], // push Notify all these devices.
    "dateSubmitted":String,
    "description":String,
    "duration":Number,
    "totalTubeinSpot":[Number],
    "geo": { // google geolocation info
      "latitude":Number,
      "longitude":Number,
      "city": String,
      "country":String,
      "state":String
    },
    "liveID":{ //our backend manangement
      type:String,  index: true
    },
    "screenSizeAvailable":[String],
    "startTime": Number, // ISO format
    "tags": [String], // all the tags
    "title": String,
    "eventType":String,
    "tubeinAdPrice": [Number],
    "tubeinPrice": [Number]
  }
},{ collection: 'events' });


class TubeModel {

  hasUserJoined(userID) {
    console.log("seeing the user joined ...")
    const flattenedArr = (this.eventInfo.tubeins || []).map(arr => {
      return arr["userID"].toString();
    });
    console.log(flattenedArr);
    console.log(userID);
    console.log(flattenedArr.indexOf(userID))
    return flattenedArr.indexOf(userID) > -1
  }
}

const Tube = tubeSchema.loadClass(TubeModel);
module.exports = mongoose.model("Tube", Tube);
