
require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');

app.options('*', cors()) 

 app.use(cors({
   origin: ['https://main-kqa7.vercel.app', 'http://localhost:5173'],
   credentials: true,
 }));


app.use(express.json());

app.use(function(req, res, next) {
      // res.header("Access-Control-Allow-Origin", "*");
      const allowedOrigins = ['https://main-kqa7.vercel.app', 'http://localhost:5173'];
      const origin = req.headers.origin;
      if (allowedOrigins.includes(origin)) {
           res.setHeader('Access-Control-Allow-Origin', origin);
      }
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      res.header("Access-Control-Allow-credentials", true);
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
      next();
    });


const multer = require('multer');
const jwt = require('jsonwebtoken');
const path = require('path');
const videoController = require('./ServerFiles/videoController');
const Uploadvideo = require('./ServerFiles/Uploadvideo');
const UploadForm = require('./ServerFiles/UploadForm');
const Verification = require('./ServerFiles/Verification');
const EmailCheck = require('./ServerFiles/Emailcheck');
const Passcheck = require('./ServerFiles/Passcheck');
const Watchvideos = require('./ServerFiles/Watchvideos');
const RetrieveTokenData = require('./ServerFiles/RetreiveTokenData');
const CreateChannel = require('./ServerFiles/CreateChannel');
const CheckAccount = require('./ServerFiles/CheckAccount');
const VerifyId = require('./ServerFiles/VerifyId');
const SetTheme = require('./ServerFiles/SetTheme');
const SubUnsub = require('./ServerFiles/Watchpagefiles/sub-unsub');
const Likedislike = require('./ServerFiles/Watchpagefiles/like-dislike');
const CommentHandler = require('./ServerFiles/Watchpagefiles/commenthandler');
const RetreiveCommentsandReplies = require('./ServerFiles/Watchpagefiles/RetrieveComments');
const UpdateComment = require('./ServerFiles/Watchpagefiles/Updatecomment');
const UploadReplies = require('./ServerFiles/Watchpagefiles/replieshandler');
const GetReplies = require('./ServerFiles/Watchpagefiles/retreivereplies');
const UpdateReplies = require('./ServerFiles/Watchpagefiles/Updatereplies');
const Deletecomment = require('./ServerFiles/Watchpagefiles/deleteComment');
const Deletereply = require('./ServerFiles/deletereply');
const LikeDislikecomment = require('./ServerFiles/Watchpagefiles/likedislikecomments/likedislikecomment');
const GetSubscribers = require('./ServerFiles/Homepagefiles/getsubscriptions');
//const streamVideo = require('./ServerFiles/Watchpagefiles/Streamvideo');

let nanoid;
import('nanoid')
  .then((module) => {
    nanoid = module.nanoid;
  })
  .catch((error) => {
    console.error('Failed to import nanoid:', error);
  });


// app.use(cors());



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Videos/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: multer.memoryStorage() });

app.get('/api', (req, res) => {
  res.json({ users: ['userone', 'usertwo'] });
});

app.post('/upload', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]), Uploadvideo)

app.post('/uploadForm',  upload.none(), UploadForm)

app.post('/Verification', upload.none(), Verification);

app.post('/Emailcheck', upload.none(), EmailCheck);

function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userAuth )=>{
    if(err) return res.sendStatus(403)
    req.user = userAuth
    next()
  })
}

app.get('/AuthenticateToken', authenticateToken, (req, res)=>{
    const user = req.user
    res.json({user: user})
})

app.post('/Passcheck', upload.none(), Passcheck)

app.post('/api/videos', upload.none(), videoController);

app.post('/api/watchvideos', upload.none(), Watchvideos);

app.post('/RetrieveTokenData', upload.none(), RetrieveTokenData);

app.post('/CreateChannel', upload.fields([
  { name: 'profilepic', maxCount: 1 },
]), CreateChannel);

app.post('/CheckAccount', upload.none(), CheckAccount);

app.post('/VerifyId',  upload.none(), VerifyId);

app.post('/setTheme', upload.none(), SetTheme);

app.post('/Subunsub', upload.none(), SubUnsub);

app.post('/Likedislike', upload.none(), Likedislike)

app.post('/Commenthandler', upload.none(), CommentHandler)

app.post('/Retrievecomments', upload.none(), RetreiveCommentsandReplies)

app.post('/Updatecomment', upload.none(), UpdateComment)

app.post('/Replyhandler', upload.none(), UploadReplies)

app.post('/Retrievereplies', upload.none(), GetReplies)

app.post('/Updatereplies', upload.none(), UpdateReplies)

app.post('/Deletecomment', upload.none(), Deletecomment)

app.post('/Deletereply', upload.none(), Deletereply)

app.get('/servechunk', upload.none(), (req, res)=>{

  console.log('reached')
  const videoPath = path.join(__dirname, 'Testenviro/y2mate.com - 30 Second Explainer Videos_1080p (1).mp4');
  res.sendFile(videoPath);
    
})

app.post('/LikedislikeComment', upload.none(), LikeDislikecomment)

app.post('/getSubscriptions', upload.none(), GetSubscribers)

//app.get('/streamVideo', upload.none(), streamVideo)

app.listen(5001, () => {
  console.log('Server started on port 5001');
});



