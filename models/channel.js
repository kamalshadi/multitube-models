const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const connection = require('../model_app').connection;

const channelSchema = new Schema({
  account: { type: Schema.Types.ObjectId, ref: 'User' }, // by object id of user not userID
  tubeIDs: [{type: Schema.Types.ObjectId, ref: 'Event' }],
  subscribers:[{ type: Schema.Types.ObjectId, ref: 'User' }],
  hasProfileImage:{type:Boolean,default:false},
  hasPromoImage:{type:Boolean,default:false},
  hasLogo: {type:Boolean,default:false},
  // nextLiveEvent: { type: Date, default: Date.now },
  nextLiveEvent: { type: Number, default: function(){return new Date().getTime()} },
  name: { type: String, required: true },
  numberOfSubscribers: {Number, default:0},
  channelType: { type: String, required: true },
  broadcastType: { type: String},
  description: String,
  sessionID: String, //opentok
  rtmp: String,
  settings: {
    preferredLayouts: [String],
    maxMinutes: Number,
    minMinutes: Number,
    minPrice: Number,
    maxPrice: Number
  },
  stats: {
    averageView: {type:Number,default:0},
    totalVideo: {type:Number,default:0},
    totalLiveEvents: {type:Number,default:0},
    numberOfSubscribers: {type:Number,default:0}
  },
  created_at:  { type: Date, default: Date.now },
  updated_at:  { type: Date, default: Date.now },
  default: { type: Boolean, default: false}
}, { collection: 'channels' });

channelSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

class ChannelModel {
}

channelSchema.loadClass(ChannelModel);
const Channel = connection.model('Channel', channelSchema);

module.exports = Channel;
