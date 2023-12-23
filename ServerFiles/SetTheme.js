const FormData = require('./formdatamodel')

const SetTheme =  async (req, res)=>{
    const formData = req.body
    console.log(formData)
    const theme = formData.theme
    const userID = formData.userID
  
    const user = await FormData.findOne({userID})
  
    if(user){
      user.Theme = theme
      await user.save()
      res.json('saved theme successfully')
    }else{
      res.status(500).json({ error: 'Failed to save theme' });
    }
   
  }


  module.exports = SetTheme;