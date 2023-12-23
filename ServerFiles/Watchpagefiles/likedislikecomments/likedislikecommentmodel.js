const mongoose = require('mongoose');
const { Schema } = mongoose;


const LikeDislikeCommentSchema = new Schema({
    userID: String,
    commentID: String,
    liked: {type: Boolean, default: false},
    disliked:{type: Boolean, default: false}
})

const LikeDislikeCommentForm = mongoose.model('LikedislikesCommentsData', LikeDislikeCommentSchema, 'likesdislikesCommentsmetadata')
module.exports = LikeDislikeCommentForm;