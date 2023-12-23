const mongoose = require('mongoose');
const { Schema } = mongoose;


const RepliesSchema = new Schema({
    userID: String,
    parentID: String,
    replyID: String,
    comment: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    pfpUrl: String,
    username: String,
    UploadedAt: {type: Date, default: Date.now},
    pfpBg: String,
});

const RepliesForm = mongoose.model('RepliesData', RepliesSchema, 'Repliesdata');
module.exports = RepliesForm;

