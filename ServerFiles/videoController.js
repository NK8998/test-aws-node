const Video = require('./videomodel'); 

const fetchVideos = async (req, res) => {
  try {
    const { filter } = req.body;
  
    let videos;

    if (!filter) {
      // If the filter is null or undefined, retrieve all videos
      videos = await Video.aggregate([
        { $sample: { size: 300 } }, // Retrieve a random sample of 300 videos
        { $sort: { UploadedAt: -1 } }, // Sort the videos by UploadedAt in descending order
      ]);
    } else {
      if (filter === 'all') {
        videos = await Video.aggregate([
          { $sample: { size: 300 } }, 
          { $sort: { UploadedAt: -1 } }, 
        ]);
      } else {
        videos = await Video.aggregate([
          { $match: { Category: filter } }, 
          { $sample: { size: 300 } }, // Retrieve a random sample of 300 videos
          { $sort: { UploadedAt: -1 } }, 
        ]);
      }
    }

    for (let i = videos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [videos[i], videos[j]] = [videos[j], videos[i]];
    }
    res.json(videos); // Send the retrieved videos as JSON response
  } catch (error) {
    console.error('Failed to fetch videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

module.exports = fetchVideos;
