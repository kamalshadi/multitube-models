const mongoose = require('mongoose');
const connection = require('../model_app').connection;
const Schema = mongoose.Schema;

const acpSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' }, // by object id of user not userID
  content_provider:String,
  rating:String,
  genre:String,
  synopsis:String,
  video_sample:String,
  created_at:  { type: Date, default: Date.now },
  updated_at:  { type: Date, default: Date.now }
},{ collection: 'ACPS' });

acpSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

class acpModel {


}

acpSchema.loadClass(acpModel);
const ACP = mongoose.model('ACP', acpSchema);


module.exports = ACP;
