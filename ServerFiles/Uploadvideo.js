const Video = require('./videomodel'); 
const FormData = require('./formdatamodel')
const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const firebase = require('firebase/app');
const {getStorage, ref, uploadBytes,getDownloadURL} = require("firebase/storage");
ffmpeg.setFfprobePath(ffprobePath);
ffmpeg.setFfmpegPath(require('ffmpeg-static'));

let nanoid;
import('nanoid')
  .then((module) => {
    nanoid = module.nanoid;
  })
  .catch((error) => {
    console.error('Failed to import nanoid:', error);
  });

  const firebaseConfig = {
    apiKey: "AIzaSyAZrRqWkHdBl1uPrmZ1W0ZjNDruN_oYzb4",
    authDomain: "new-db-9a0ba.firebaseapp.com",
    projectId: "new-db-9a0ba",
    storageBucket: "new-db-9a0ba.appspot.com",
    messagingSenderId: "699118592183",
    appId: "1:699118592183:web:491b1cacabd5635d8f2d32"
  };
  
  firebase.initializeApp(firebaseConfig);
const storageFirebase = getStorage()

const Uploadvideo = async (req, res) => {
  const { video, thumbnail } = req.files;
  const { title, channelID, Category, Description } = req.body;
  try {
    const uniqueId = await nanoid();
  
    const videoFile = video[0];
    const videoMetadata = {
      contentType: 'video/mp4',
    };

    const temporaryFilePath = path.join(os.tmpdir(), videoFile.originalname);
    fs.writeFileSync(temporaryFilePath, videoFile.buffer); 
  

   
    const duration = await extractVideoDuration(temporaryFilePath);
    console.log('Video duration:', duration);
    const resolutions = ['1080', '720', '480', '360', '240'];
    const videoUrls = {};
    const videoInfo = await getVideoInfo(temporaryFilePath);
    console.log(videoInfo)
    const { width, height } = videoInfo;
  

    const filteredResolutions = resolutions.filter((resolution) => {
      return resolution <= height;
    })
 


    for (const resolution of filteredResolutions) {
      const videoStorageRef = ref(
        storageFirebase,
        `videos/${videoFile.originalname}_${uniqueId}_${resolution}`
      );
      const temporaryDirectory = os.tmpdir();


      const uniqueFilename = `${resolution}_${videoFile.originalname}`;

      const outputPath = path.join(temporaryDirectory, uniqueFilename);
        
    
      let bitrate;
      if (resolution === '1080') {
        bitrate = '6000k';
      } else if (resolution === '720') {
        bitrate = '4000k';
      } else if (resolution === '480') {
        bitrate = '2000k';
      } else if (resolution === '360') {
        bitrate = '1000k';
      } else if (resolution === '240') {
        bitrate = '700k';
      }
    
      await transcodeVideo(temporaryFilePath, outputPath, resolution, width, bitrate);
    
      const videoBuffer = await fs.promises.readFile(outputPath);
      await uploadBytes(videoStorageRef, videoBuffer, videoMetadata);
    
      const videoDownloadURL = await getDownloadURL(videoStorageRef);
      const readableResolution = 'R' + resolution;
      videoUrls[readableResolution] = videoDownloadURL;
      console.log(`Uploaded ${resolution} video: ${videoDownloadURL}`);
    }

    fs.unlink(temporaryFilePath, (err) => {
      if (err) {
        console.error('Failed to delete the file:', err);
        return;
      }
      console.log('File deleted successfully');
    });
   
    let thumbnailDownloadURL = null;
    if (thumbnail && thumbnail.length > 0) {
      const thumbnailFile = thumbnail[0];
      const thumbnailSize = thumbnailFile.size;
      const thumbnailSizeKB = thumbnailSize / 1024;
      const maxSize = 2560;

      if (thumbnailSizeKB <= maxSize) {
        const compressedBuffer = await compressImage(thumbnailFile.buffer);

        const thumbnailStorageRef = ref(
          storageFirebase,
          `thumbnails/${thumbnailFile.originalname}`
        );
        const thumbnailMetadata = {
          contentType: 'image/jpeg',
        };

        await uploadBytes(thumbnailStorageRef, compressedBuffer, thumbnailMetadata);
        thumbnailDownloadURL = await getDownloadURL(thumbnailStorageRef);
        console.log('Thumbnail download URL:', thumbnailDownloadURL);
      } else {
        const errorMessage = 'Please upload a thumbnail file less than 2 MB.';
        console.error(errorMessage);
        return res.status(400).json({ error: errorMessage });
      }
    }

    const user = await FormData.findOne({ channelID });
    if (!user) {
      console.log('User not found');
    }
    const { username, pfpUrl, pfpBg } = user;

    const Categorylower = Category.toLowerCase();

    const newVideo = new Video({
      title: title,
      thumbnailUrl: thumbnailDownloadURL,
      UniqueID: uniqueId,
      UploadedBy: username,
      pfpUrl: pfpUrl,
      pfpBg: pfpBg,
      Category: Categorylower,
      Duration: duration,
      Description: Description,
      channelID: channelID,
      videoUrls:videoUrls,
    });

    await newVideo.save();
    console.log('Video uploaded to MongoDB with Firebase download URLs');

    res.status(200).json('Video uploaded');

    res.status(200).json('chunks generated');
   
  } catch (error) {
    console.error('Failed to upload video to MongoDB:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
};

module.exports = Uploadvideo;


const transcodeVideo = (inputPath, outputPath, resolution, width, bitrate) => {
  console.log({
    'inputPath': inputPath,
    'outputPath': outputPath,
    'resolution': resolution,
    'bitrate': bitrate
  });

  return new Promise((resolve, reject) => {
   

      const size = `${width}x${resolution}`
  

      ffmpeg(inputPath)
        .videoCodec('libx264')
        .audioCodec('libmp3lame')
        .size(size)
        // .videoBitrate(bitrate)
        .outputOptions('-crf 20')
        .output(outputPath)
        .on('end', () => {
          console.log('Video transcoded:', outputPath);
          resolve();
        })
        .on('error', (error) => {
          console.error('Error transcoding video:', error);
          reject(error);
        })
        .on('error', function(err, stdout, stderr) {
          if (err) {
              console.log(err.message);
              console.log("stdout:\n" + stdout);
              console.log("stderr:\n" + stderr);
              reject("Error");
          }
      })
      .run()
   
  });
};


const extractVideoDuration = async (videoBuffer) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoBuffer, (err, metadata) => {
      if (err) {
        console.error('Failed to extract video duration:', err);
        reject(err);
      } else {
        const duration = metadata.format.duration;
        resolve(duration);
      }
    });
  });
};


async function compressImage(buffer) {
  const targetSize = 70; // Target size in (KB)
  let quality = 80;

  let compressedBuffer = await sharp(buffer)
    .resize({ width: 362, height: 212, fit: 'cover' })
    .jpeg({ quality })
    .toBuffer();

  while (compressedBuffer.length / 1024 > targetSize) {
    quality -= 5;
    compressedBuffer = await sharp(compressedBuffer)
      .jpeg({ quality })
      .toBuffer();
  }

  return compressedBuffer;
}

const getVideoInfo = async (videoPath) => {
  console.log(videoPath)
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, info) => {
      if (err) {
        console.error('Failed to get video information:', err);
        reject(err);
      } else {
        const { width, height } = info.streams[0].coded_width > 0
          ? info.streams[0]
          : info.streams[1];
        resolve({ width, height });
      }
    });
  });
};


