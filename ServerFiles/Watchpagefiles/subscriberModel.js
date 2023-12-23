const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubscriberSchema = new Schema({
    SubscriberName: String,
    SubscriberID: String,
    SubscribedTo: String,
    pfpUrl: String,
    pfpBg: String,
    firstName: String,
    handle: String


})


const SubscriberData = mongoose.model('SubsData', SubscriberSchema, 'Subscribers-metadata');
module.exports = SubscriberData;