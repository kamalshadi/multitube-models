const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const connection = require('../model_app').connection;

const requestSchema = new Schema({
  sender_user: { type: Schema.Types.ObjectId, ref: 'User' }, // Who is sending the request
  target_channel : String,
  requestType: String,
  note : String,
  selectedAirTime : Number,
  offeredMoney : Number,
  selectedScreenSize : String,
  created_at:  { type: Date, default: Date.now },
  updated_at:  { type: Date, default: Date.now }
}, { collection: 'requests' });

 requestSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

class requestsModel {
}

requestSchema.loadClass(requestsModel);
const Request = connection.model('Request', requestSchema);

module.exports = Request;
