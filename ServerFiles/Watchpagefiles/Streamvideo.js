//const axios = require('axios');

const streamVideo = async (req, res) => {
  console.log('reached')
  const { byteRanges, currentTime, url } = req.query;
  console.log(url)

  const parsedByteRanges = JSON.parse(byteRanges);

  const chunk = parsedByteRanges.find((chunk) => chunk.startTime <= currentTime && chunk.endTime >= currentTime);
  console.log(chunk)
  const finalChunkposition = parsedByteRanges.length - 1
  const finalChunk = parsedByteRanges[finalChunkposition]
  if (!chunk) {
    return res.status(400).json({ error: 'Requested time not found in available chunks' });
  }

  const headers = { Range: `bytes=${chunk.byteRangeStart}-${chunk.byteRangeEnd}` };

  try {
    const response = await axios.get(url, {
      headers: {
        ...headers,
        'Cache-Control': 'no-cache',
      },
      responseType: 'arraybuffer',
   
      // validateStatus: (status) => status === 206, 
    });

    res.set({
      'Content-Range': `bytes ${chunk.byteRangeStart}-${chunk.byteRangeEnd}/${finalChunk.byteRangeEnd}`,
      'Accept-Ranges': 'bytes',
      'Content-Type': 'video/mp4',
      'Content-Length': response.data.length,
  
    });

    res.status(206).send(response.data);
  } catch (error) {
    console.error('Error retrieving video chunk:', error);
    res.status(500).json({ error: 'Error retrieving video chunk' });
  }
};

module.exports = streamVideo;


