
const SubscriberData = require("../Watchpagefiles/subscriberModel");



const GetSubscribers = async (req, res)=>{
    try{

        const {userID} = req.body
        const SubscriberID = userID

        const subscribedTo = await SubscriberData.find({SubscriberID})

        if (subscribedTo.length > 0) {
            res.status(200).json([subscribedTo]);
          } else {
            res.status(204).json([]);
          }
       

    }catch(error){
      return  res.status(500).json('could not get subscribers', error)
    }
}

module.exports = GetSubscribers;