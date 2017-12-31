var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const tubeinSchema = new Schema({
    "tubeinType": {type:String, default:'user'},
    "userID": { type: Schema.Types.ObjectId, ref: 'User' },
    "fullname": String,
    "description": String,
    "geo": {
      "continent": String,
      "city": String,
      "country": String,
      "state": String,
      "latitude": Number,
      "longitude": Number
    },
    "duration": {type:Number, default:60},
    "screenSizeAvailable": {type:String, default:"one-fifth.png"},
    "tubeinTime": { type: Date, default: Date.now },
    "tubeinStatusChangeTime": { type: Date, default: Date.now },
    "revenue": {type:Number, default:0},
    "startTime": {type:Number, default:0},
    "track": {type:Number, default:1},
    "userTubeinStatus": {type:String, default:"pending"},
    "filled":{type:Boolean, default:false},
    "icon": {type:String, default:"female-user.jpeg"}
});

var tubeinsSchema = new Schema({
  "presetFlag" : {type:Boolean, default:true},
  "global": {
    "tubeID": { type: Schema.Types.ObjectId, ref: 'Tube' },
    "tubeDuration": {type:Number, default:0},
    "tubeinSessionDuration": {type:Number, default:0},
    "startTime": {type:Number, default: Date.now },
    "NTracks": {type:Number, default:5},
    "NBlocks": {type:Number, default:2},
    "NTubeins": {type:Number, default:20}
  },
  "tubeinBlocks": [
    {
      "blockStarts": Number,
      "blockEnds": Number,
      "NTubeins": Number
    },
    {
      "blockStarts": Number,
      "blockEnds": Number,
      "NTubeins": Number
    }
  ],
  "tubeins": [
    [tubeinSchema],
    [tubeinSchema],
  ],
  "acceptedTubeins": [
    [tubeinSchema],
    [tubeinSchema]
  ]
},{ collection: 'tubeins' });


class TubeinsModel {

}

class TubeinModel {

}

const Tubein = tubeinSchema.loadClass(TubeinModel);
const Tubeins = tubeinsSchema.loadClass(TubeinsModel);
module.exports.Tubeins = mongoose.model("Tubeins", Tubeins);
module.exports.Tubein = mongoose.model("Tubein", Tubein);
