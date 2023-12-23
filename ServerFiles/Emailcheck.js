const FormData = require('./formdatamodel')

const EmailCheck = async (req, res) => {
    const formData = req.body;
    const { email } = formData;
  
    const user = await FormData.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email not found' });
    }
  
    console.log('Email found:', user.email);
   
  
    res.json({ success: true });
  }

module.exports = EmailCheck;