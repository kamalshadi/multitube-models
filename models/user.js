const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connection = require('../model_app').connection;
const Schema = mongoose.Schema;

const userSchema = new Schema({
  phoneNumber: { type: String, index: true, unique: true, sparse: true, trim: true },
  deviceToken: { type: String, unique: true, sparse: true },
  channels: [{ type: Schema.Types.ObjectId, ref: 'Channel' }], //Array of object ids of channel not channelID
  fullName: {type:String, required:true},
  hasProfileImage:{type:Boolean, default:false},
  email: { type: String, index: true, unique: true, trim: true, lowercase: true, sparse: true },
  address: String,
  password: String,
  provider: String,
  provider_id: String,
  verified: {type: Boolean, default: false},
  verificationToken: {type: String, unique: true, sparse: true},
  passRecoveryToken: {type: String, unique: true, sparse: true},
  geo:{
    city: {type:String, default:""},
    country: {type:String, default:""},
    state: {type:String, default:""},
    latitude: Number,
    longitude: Number
  },
  selectedCountry: String,
  membership: {type:String, default:"trial"},
  subscribedChannel:[{ type: Schema.Types.ObjectId, ref: 'Channel' }],
  moderator:{type:Boolean, default:false},
  ACP_Level:{ type: Number, default:-1 },
  isTubeiner:Boolean,
  kind:{type:String, default:"tubeiner"},
  created_at:  { type: Date, default: Date.now },
  updated_at:  { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

class UserModel {

  verifyPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  get country() {
    return this.geo.country
  }

  isVerified() {
    return this.verified;
  }

  static generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  }

}

userSchema.loadClass(UserModel);
const User = connection.model('User', userSchema);


module.exports = User;
