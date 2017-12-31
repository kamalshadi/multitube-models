const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt');

const userSchema = new Schema({
  phoneNumber: { type: String, index: true, unique: true, sparse: true, trim: true },
  deviceToken: { type: String, unique: true, sparse: true },
  channels: [{ type: Schema.Types.ObjectId, ref: 'Channel' }], //Array of object ids of channel not channelID
  fullName: String,
  email: { type: String, index: true, unique: true, trim: true, lowercase: true, sparse: true },
  address: String,
  password: String,
  provider: String,
  provider_id: String,
  verified: {type: Boolean, default: false},
  passRecoveryToken: {type: String, unique: true, sparse: true},
  geo:{
    region: String,
    street: String,
    zipcode: String,
    city: String,
    country: String,
    latitude: Number,
    longitude: Number
  },
  selectedCountry: String,
  subscribedChannels:[{ type: Schema.Types.ObjectId, ref: 'Channel' }],
  moderator:{type:Boolean, default:false},
  membership: {type:String,default:"trial"},
  ACP_Level:{ type: Number, default:-1 },
  kind:{type:String, default:"tubeiner"},
  created_at:  { type: Date, default: Date.now },
  updated_at:  { type: Date, default: Date.now }
}, { collection: 'users' });

userSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

class UserModel {

  verifyPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  // removing sensitive information for response
  trimmed() {
    const user = this.toJSON();
    delete user.password;
    return user;
  }

  static generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  }
}

userSchema.loadClass(UserModel);
const User = mongoose.model('User', userSchema);

module.exports = User;
