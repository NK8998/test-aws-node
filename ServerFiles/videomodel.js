const mongoose = require('mongoose');
const { Schema } = mongoose;


const uri = 'mongodb+srv://nekioko16:2L6vaVauUbsyIpLy@cluster0.xbz4axv.mongodb.net/?retryWrites=true&w=majority';
const options = {
  dbName: 'yt-database',
  useNewUrlParser: true,
  useUnifiedTopology: true
};
mongoose.connect(uri, options)
const VideoSchema = new Schema({
  title: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: [{
    username: String,
    comment: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  // videoUrl: String,
  thumbnailUrl: String,
  UniqueID: String,
  UploadedBy: String,
  pfpUrl: String,
  pfpBg: String,
  UploadedAt: {type: Date, default: Date.now},
  Category: String,
  Duration: Number,
  Description:{
    type:String,
    default:null,
  },
  channelID: String,
  videoUrls: {
    type: Map,
    of: String,
    default: {},
  },
  byteRanges: []
});
const Video = mongoose.model('Video', VideoSchema, 'video-metadata');

module.exports = Video;