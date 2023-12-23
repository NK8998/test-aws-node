const FormData = require('./formdatamodel');
const Video = require('./videomodel'); 


const Watchvideos = async (req, res) => {
    // const { uniqueId } = req.body;
    const {UniqueID} =req.body
    try {
      // console.log('Received uniqueId:', UniqueID);
  
      const video = await Video.findOne({UniqueID});
      const channelID = video.channelID;
      // console.log('Retrieved video:', video);
      const user = await FormData.findOne({channelID})

      const subCount = user.subscribers
  
      if (video) {
        res.json({video, subCount});
      } else {
        res.status(404).json({ error: 'Video not found' });
      }
    } catch (error) {
      console.error('Failed to find video:', error);
      res.status(500).json({ error: 'Failed to find video' });
    }
  }

  module.exports = Watchvideos;