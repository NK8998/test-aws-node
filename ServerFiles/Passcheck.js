const FormData = require('./formdatamodel')
const jwt = require('jsonwebtoken');

const Passcheck = async (req, res) => {
    const formData = req.body;
    // res.json(formData)
    const {email, password} = formData
    const user = await FormData.findOne({ email, password});
  
    if(!user){
      return res.status(400).json({ error: 'Incorrect password' });
    }
    if(user.VerifiedAt === null){
      return res.status(400).json({ error: 'Your account is not verified. Check your email and' });
    }
    const firstName = user.firstName
    const lastName = user.lastName
    const userID = user.userID
    const channelID = user.channelID
    
    const userAuth = { firstName: firstName,
                        lastName: lastName,
                        email: email,
                        userID: userID,
                        channelID: channelID}
    const accessToken = jwt.sign(userAuth, process.env.ACCESS_TOKEN_SECRET)
    
    user.AccessToken = accessToken;
    await user.save();
  
    res.json({ success: true, token:accessToken });
  }

  module.exports = Passcheck;