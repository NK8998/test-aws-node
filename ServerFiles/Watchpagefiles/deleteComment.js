const CommentsForm = require("./commentModel");
const RepliesForm = require("./repliesmodel");

const removeAllReplies = async (commentID) => {
    try {
      const replies = await RepliesForm.find({ parentID: commentID });
      await RepliesForm.deleteMany({ parentID: commentID });
  
      console.log('Replies deleted');
    } catch (error) {
      console.error('Could not delete replies', error);
    }
  };
  

const Deletecomment = async(req, res) =>{

    const {commentID, videoID} = req.body

    try{

        const comment = await CommentsForm.findOne({commentID})

        if(comment){
          await comment.deleteOne()
          const comments = await CommentsForm.find({videoID})
          removeAllReplies(commentID)
          res.status(200).json(comments)
        }else{
            res.status(500).json('something went wrong when deleting comment')
        }


    }catch(error){
        res.status(500).json('could not delete comment', error)
    }
}

module.exports = Deletecomment;