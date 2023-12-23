const FormData = require('./formdatamodel')

const VerifyId = async (req, res)=>{
    const channelId = req.body
   
    const channelID = channelId.channelId
  
    try{
      const user = await FormData.findOne({channelID})
      if(user){
        res.json(user.AccessToken)
        return
      }
    }
    catch (error) {
      console.error('Failed to check user:', error);
      res.status(500).json({ error: 'Failed to check user' });
    }
  
    
  
  }

  module.exports = VerifyId;