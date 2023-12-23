const FormData = require("../formdatamodel")
const SubscriberData = require("./subscriberModel")

const getSubCount = async (channelID) =>{

  const subCount = await SubscriberData.countDocuments({SubscribedTo: channelID})

  const user = await FormData.findOne({channelID : channelID});
  user.subscribers = subCount

  await user.save()

  return subCount;
}



const SubUnsub = async (req, res) =>{

    try{
    const {channelID, userID, state, firstName} = req.body
    
    const user = await FormData.findOne({channelID})
    if(state === 'subscribe'){
        const newSubscriber = new SubscriberData({
            SubscribedTo: channelID,
            SubscriberID: userID,
            SubscriberName: firstName,
            pfpUrl: user.pfpUrl,
            firstName: user.firstName,
            handle: user.username,
            pfpBg: user.pfpBg
        });

        await newSubscriber.save()
        const subCount = await getSubCount(channelID);
        res.setHeader("Cache-Control", "no-store");
        res.status(200).json({message: 'saved user', subCount})
    }else if (state === "unsubscribe") {
        await SubscriberData.deleteOne({ 
            SubscribedTo: channelID,
            SubscriberID: userID
         });
         const subCount = await getSubCount(channelID);
        res.setHeader("Cache-Control", "no-store");
      res.status(200).json({message : "removed user subscription", subCount});
      } else if (state === "check") {
        const userExists = await SubscriberData.exists({
          SubscribedTo: channelID,
          SubscriberID: userID,
        });
        const subCount = await getSubCount(channelID);
        res.setHeader("Cache-Control", "no-store");
        res.status(200).json({message : userExists, subCount});
      }
   
    
    }
    catch(error){
        console.error('Failed to save subscriber data:', error);
        res.status(500).json({ error: 'Failed to save subscriber data' });
    }
    

}

module.exports = SubUnsub;