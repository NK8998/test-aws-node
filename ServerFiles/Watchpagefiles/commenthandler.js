const FormData = require("../formdatamodel");
const CommentsForm = require("./commentModel")
const RepliesForm = require("./repliesmodel")


let nanoid;
import('nanoid')
  .then((module) => {
    nanoid = module.nanoid;
  })
  .catch((error) => {
    console.error('Failed to import nanoid:', error);
  });

const CommentHandler = async(req, res) =>{

    const {comment, userID, videoID, title} = req.body
    
     const commentID = nanoid(6)

    try{

      const user = await FormData.findOne({userID})

      const pfpUrl = user.pfpUrl
      const username = user.username
      const pfpBg = user.pfpBg

      console.log(pfpBg)
        const newComment = new CommentsForm({
            userID: userID,
            commentID: commentID,
            videoID: videoID,
            title: title,
            comment: comment,
            pfpUrl: pfpUrl,
            username: username,
            pfpBg: pfpBg,
        })

        await newComment.save()

        const comments = await CommentsForm.find({videoID})
        res.status(200).json(comments)

    }catch(error){
        res.status(500).json('could not upload comment', error)
    }
}

module.exports = CommentHandler;

