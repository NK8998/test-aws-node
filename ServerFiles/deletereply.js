const CommentsForm = require("./Watchpagefiles/commentModel");
const RepliesForm = require("./Watchpagefiles/repliesmodel");

const getTotalreplies = async(parentID) =>{
    const totalReplies = await RepliesForm.countDocuments({parentID})

    const comment = await CommentsForm.findOne({commentID:parentID})

    comment.totalreplies = totalReplies

    await comment.save()
  }
const Deletereply = async(req, res) =>{

    const {replyID, parentID} = req.body

    try{

        const reply = await RepliesForm.findOne({replyID})

        if(reply){
          await reply.deleteOne()
          const replies = await RepliesForm.find({parentID})
          getTotalreplies(parentID)
          res.status(200).json(replies)
        }else{
            res.status(500).jsone('something went wrong')
        }
    }catch(error){
        res.status(500).json('could not delete reply', error)
    }
}

module.exports = Deletereply;