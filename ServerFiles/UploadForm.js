const FormData = require('./formdatamodel')
const nodemailer = require('nodemailer');

let nanoid;
import('nanoid')
  .then((module) => {
    nanoid = module.nanoid;
  })
  .catch((error) => {
    console.error('Failed to import nanoid:', error);
  });

const UploadForm = async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
  
      // Check if user with the given email already exists
      const existingUser = await FormData.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists' });
      }
  
      const Bgcolors = ["Yellow", "Green", "blue", "red"]
  
      const i = Math.floor(Math.random() * 4);
  
      const verificationCode = generateVerificationCode();
      // Create a new user instance
      const userID = nanoid()
      const channelID = 'UC' + userID;
      const newUser = new FormData({
        firstName,
        lastName,
        email,
        password,
        verificationCode,
        userID,
        pfpBg: Bgcolors[i],
        channelID
      });
  
      const savedUser = await newUser.save();
      console.log('Form data saved successfully');
      res.json({ data: savedUser });
  
      sendVerificationEmail(email, verificationCode);
    } catch (error) {
      console.error('Failed to save form data:', error);
      res.status(500).json({ error: 'Failed to save form data' });
    }
  
  
  function generateVerificationCode() {
    // Generate a random code or use any other method to generate a code
    const min = 100000; // Minimum value (inclusive)
    const max = 999999; // Maximum value (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function sendVerificationEmail(email, verificationCode) {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth:{
        user: 'jobsexe4@gmail.com',
        pass: 'whwmqvcsfkcpluvz'
      }
    });
  
    // Configure the email message
    const mailOptions = {
      from: 'Google',
      to: email,
      subject: 'Account Verification',
      text: `Your verification code is: ${verificationCode}`,
    };
  
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Failed to send verification email:', error);
      } else {
        console.log('Verification email sent:', info.response);
      }
    });
}

}

module.exports = UploadForm