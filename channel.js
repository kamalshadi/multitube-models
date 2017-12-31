const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const channelSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' }, // by object id of user not userID
  subscribers:[{ type: Schema.Types.ObjectId, ref: 'User' }],
  nextLiveEvent: Date,
  nextLiveEvent_: String,
  name: { type: String, required: true },
  numberOfSubscribers: Number,
  perviousOnMT: String,
  type: { type: String, required: true },
  description: String,
  sessionID: String,
  rtmp: String,
  settings: {
    preferredLayouts: [String],
    maxMinutes: Number,
    minMinutes: Number,
    minPrice: Number,
    maxPrice: Number
  },
  stats: {
    averageView: Number,
    totalVideo: Number,
    totalLiveEvents: Number,
    numberOfSubscribers: Number
  },
  created_at:  { type: Date, default: Date.now },
  updated_at:  { type: Date, default: Date.now }
}, { collection: 'channels' });

channelSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

class ChannelModel {
}

channelSchema.loadClass(ChannelModel);
const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
