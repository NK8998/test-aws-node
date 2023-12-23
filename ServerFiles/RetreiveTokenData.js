const FormData = require('./formdatamodel')
const jwt = require('jsonwebtoken');


const RetrieveTokenData = async (req, res)=>{
    const {accessToken} = req.body
  
    try {
      const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const { firstName, lastName, userID, channelID  } = decodedToken;
  
      const user = await FormData.findOne({userID})
  
      const pfpBg = user.pfpBg
      const pfpUrl = user.pfpUrl
      const Theme = user.Theme
      
      
  
      // Include the necessary data in the API response
      res.json({ firstName, lastName, userID, pfpBg, pfpUrl, Theme, channelID });
    } catch (error) {
      console.error('Failed to verify token:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  }


module.exports = RetrieveTokenData;