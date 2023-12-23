const FormData = require('./formdatamodel')
const firebase = require('firebase/app');
const {getStorage, ref, uploadBytes,getDownloadURL} = require("firebase/storage")
const sharp = require('sharp');

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

const CreateChannel = async (req, res) => {
    const formData = req.body;
    const userID = formData.userID;
    const username = formData.Username;
    const { profilepic } = req.files;
  
    try {
      const user = await FormData.findOne({ userID });
  
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      user.username = username;
  
      if (profilepic && profilepic.length > 0) {
        const profilePicFile = profilepic[0];
        const profilePicStorageRef = ref(storageFirebase, 'profilePics/' + profilePicFile.originalname);
        const profilePicMetadata = {
          contentType: 'image/jpeg',
        };
        const compressedBuffer = await compressImage(profilePicFile.buffer);
  
        await uploadBytes(profilePicStorageRef, compressedBuffer, profilePicMetadata);
  
        const profilePicDownloadURL = await getDownloadURL(profilePicStorageRef);
        console.log('Profile picture download URL:', profilePicDownloadURL);
  
        user.pfpUrl = profilePicDownloadURL;
       
      }
  
      await user.save();
      res.json('Username and profile picture updated');
    } catch (error) {
      console.error('Failed to update user:', error);
      res.status(401).json({ error: 'Failed to update user' });
    }
  }

  module.exports = CreateChannel;

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