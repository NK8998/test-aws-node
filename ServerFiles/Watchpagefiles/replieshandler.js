const FormData = require("../formdatamodel");
const CommentsForm = require("./commentModel");
const RepliesForm = require("./repliesmodel");


let nanoid;
import('nanoid')
  .then((module) => {
    nanoid = module.nanoid;
  })
  .catch((error) => {
    console.error('Failed to import nanoid:', error);
  });

 
  const getTotalreplies = async(parentID) =>{
    const totalReplies = await RepliesForm.countDocuments({parentID})

    const comment = await CommentsForm.findOne({commentID:parentID})

    comment.totalreplies = totalReplies

    await comment.save()
  }

const UploadReplies = async (req, res) =>{

    const {userID, parentID, replyText} = req.body

    const replyID = nanoid(6)
    try{
        
      const user = await FormData.findOne({userID})

      const pfpUrl = user.pfpUrl
      const username = user.username
      const pfpBg = user.pfpBg

        const newReply = new RepliesForm({
            userID: userID,
            parentID: parentID,
            comment: replyText,
            replyID: replyID,
            pfpUrl: pfpUrl,
            username: username,
            pfpBg: pfpBg

        });

        await newReply.save()
        getTotalreplies(parentID)
        res.status(200).json(newReply)

    }catch(error){
        res.status(500).json('could not upload comment')
    }
}

module.exports = UploadReplies;