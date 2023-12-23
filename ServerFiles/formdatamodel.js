const mongoose = require('mongoose');
const { Schema } = mongoose;


const formSchema = new Schema({
    firstName: String,
    lastName: String,
    username: {
      type: String,
      default:null
    },
    userID: String,
    channelID: String,
    subscribers:{
      type: Number,
      default:null
    },
    email: String,
    password: String,
    verificationCode: String,
    pfpUrl: {
      type: String,
      default:null
    },
    VerifiedAt: {
      type: Date,
      default: null
    },
    AccessToken:{
      type: String,
      default:null
    },
    pfpBg: String,
    Theme: {
      type: String,
      default:null
    },
  })
  
  const FormData = mongoose.model('FormData', formSchema, 'user-info');

  module.exports = FormData;