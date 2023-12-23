const FormData = require('./formdatamodel')

const Verification = async (req, res) => {
    try {
      const { verificationCode, email } = req.body;
  
      const user = await FormData.findOne({ email, verificationCode });
  
      if (!user) {
        return res.status(400).json({ error: 'Invalid verification code' });
      }
  
      
      user.VerifiedAt = new Date();
      await user.save();
  
      res.json({ message: 'Verification successful' });
    } catch (error) {
      console.error('Failed to verify email:', error);
      res.status(500).json({ error: 'Failed to verify email' });
    }
  }

  module.exports = Verification;