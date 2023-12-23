const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
    userID: String,
    commentID: String,
    videoID: String,
    title: String,
    comment: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    totalreplies: {
        type:Number,
        default:0
    },
    pfpUrl: String,
    username: String,
    UploadedAt: {type: Date, default: Date.now},
    pfpBg: String,

});

const CommentsForm = mongoose.model('CommentsData',  CommentSchema, 'ParentCommentsdata' );
module.exports = CommentsForm;