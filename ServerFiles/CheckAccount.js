const FormData = require('./formdatamodel')
const jwt = require('jsonwebtoken');

const CheckAccount =  async (req, res) => {
   
    const { accessToken } = req.body;
    try {
      const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const { userID } = decodedToken;
  
      const user = await FormData.findOne({ userID, username: { $ne: null } });
  
     
      if (user) {
        const pfpBg = user.pfpBg
        const name = user.firstName
        res.json({ pfpBg, name});
      } else {
        
        return
      }
    } catch (error) {
      console.error('Failed to check account:', error);
      res.status(500).json({ error: 'Failed to check account' });
    }
  }

  module.exports = CheckAccount;