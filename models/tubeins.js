var mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const connection = require('../app').connection;

var tubeinsSchema = new Schema({
  "presetFlag" : {type:Boolean, default:true},
  "global": {
    "tubeID": { type: Schema.Types.ObjectId, ref: 'Event' },
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
    [
      {
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
        "duration": Number,
        "screenSizeAvailable": String,
        "tubeinTime": { type: Date, default: Date.now },
        "tubeinStatusChangeTime": { type: Date, default: Date.now },
        "revenue": {type:Number, default:0},
        "startTime": {type:Number, default:0},
        "track": {type:Number, default:1},
        "userTubeinStatus": {type:String, default:"pending"}
      }
    ],
    [
    {
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
      "duration": Number,
      "screenSizeAvailable": String,
      "tubeinTime": { type: Date, default: Date.now },
      "tubeinStatusChangeTime": { type: Date, default: Date.now },
      "revenue": {type:Number, default:0},
      "startTime": {type:Number, default:0},
      "track": {type:Number, default:1},
      "userTubeinStatus": {type:String, default:"pending"}
    }
    ]
  ],
  "acceptedTubeins": [
    [
      {
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
        "duration": Number,
        "screenSizeAvailable": String,
        "tubeinTime": { type: Date, default: Date.now },
        "tubeinStatusChangeTime": { type: Date, default: Date.now },
        "revenue": {type:Number, default:0},
        "startTime": {type:Number, default:0},
        "track": {type:Number, default:1},
        "userTubeinStatus": {type:String, default:"pending"},
        "filled":{type:Boolean, default:false},
        "icon": {type:String, default:"female-user.jpeg"}
      }
    ],
    [
      {
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
        "duration": Number,
        "screenSizeAvailable": String,
        "tubeinTime": { type: Date, default: Date.now },
        "tubeinStatusChangeTime": { type: Date, default: Date.now },
        "revenue": {type:Number, default:0},
        "startTime": {type:Number, default:0},
        "track": {type:Number, default:1},
        "userTubeinStatus": {type:String, default:"pending"},
        "filled":{type:Boolean, default:false},
        "icon": {type:String, default:"female-user.jpeg"}
      }
    ]
  ]
},{ collection: 'tubeins' });

tubeinsSchema.pre('save', function(next) {
  console.log(this)
  console.log('--- --- - -- - - - - - - -')
  if (this.presetFlag){
  num1 = this.tubeinBlocks[0].NTubeins;
  if (this.tubeinBlocks.length == 2){
    num2 = this.tubeinBlocks[1].NTubeins;
  }
  else{
    num2 = 0;
  }
  console.log(num1)
  console.log(num2)
  placeholder = [];
  for (var i=0; i<num1; i++){
    let cur_placeholder = {filled:false,icon:"female-user.jpeg","userTubeinStatus":"pending"};
    let cur_track = 3;
    while (cur_track == 3){
      cur_track = Math.ceil(5*Math.random());
    }
    console.log(cur_track)
    st = this.tubeinBlocks[0].blockStarts;
    du = this.tubeinBlocks[0].blockEnds - st;
    cur_start = st + Math.floor(du*Math.random())
    cur_placeholder['track'] = cur_track
    cur_placeholder['startTime'] = cur_start
    placeholder.push(cur_placeholder)
    console.log('done')
  }
  console.log(placeholder)
  placeholder2 = []
  for (var i=0; i<num2; i++){
    let cur_placeholder = {filled:false,icon:"female-user.jpeg","userTubeinStatus":"pending"};
    let cur_track = 3;
    while (cur_track == 3){
      cur_track = Math.ceil(5*Math.random());
    }
    st = this.tubeinBlocks[1].blockStarts;
    du = this.tubeinBlocks[1].blockEnds - st;
    cur_start = st + Math.floor(du*Math.random());
    cur_placeholder['track'] = cur_track;
    cur_placeholder['startTime'] = cur_start;
    placeholder2.push(cur_placeholder);
  }

  this.acceptedTubeins[0] = placeholder;
  this.acceptedTubeins[1] = placeholder2;
  this.presetFlag = false;
  this.tubeins=[[],[]]

}
  next()
})

class TubeinsModel {

}

const Tubeins = tubeinsSchema.loadClass(TubeinsModel);
module.exports = connection.model("Tubeins", Tubeins);
