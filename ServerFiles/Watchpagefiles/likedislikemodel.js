const mongoose = require('mongoose');
const { Schema } = mongoose;

const LikeDislikeSchema = new Schema({
    userID: String,
    videoID: String,
    liked: {type: Boolean, default: false},
    disliked:{type: Boolean, default: false}
})

const LikeDislike = mongoose.model('LikedislikesData', LikeDislikeSchema, 'likesdislikesmetadata')
module.exports = LikeDislike;