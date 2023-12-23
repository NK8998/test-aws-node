const CommentsForm = require("../commentModel");
const RepliesForm = require("../repliesmodel");
const LikeDislikeCommentForm = require("./likedislikecommentmodel");

const getLikesDislikesCount = async (commentID, type) =>{
    const likesCount = await LikeDislikeCommentForm.countDocuments({ commentID, liked: true });
    const dislikesCount = await LikeDislikeCommentForm.countDocuments({ commentID, disliked: true });
  
    if(type === 'comment'){
        const comment = await CommentsForm.findOne({commentID})

        comment.likes = likesCount
        comment.dislikes = dislikesCount

        await comment.save()
        console.log('comment likes updated')

    }else if(type === 'reply'){
        const reply = await RepliesForm.findOne({replyID: commentID})
        reply.likes = likesCount
        reply.dislikes = dislikesCount

        await reply.save()
        console.log('comment likes updated')
    }
}


const LikeDislikecomment = async (req, res) =>{
    try{
        const { commentID, userID, state, type } = req.body;

        if (state === "like") {
          const user = await LikeDislikeCommentForm.findOne({ commentID, userID });
          if (user) {
            if (user.disliked === false && user.liked === true) {
              await LikeDislikeCommentForm.deleteOne({ commentID, userID });
              getLikesDislikesCount(commentID, type);
              return res.status(201).json("Video removed from liked videos");
            } else if (user.disliked === true && user.liked === false) {
              user.disliked = false;
              user.liked = true;
              await user.save();
              getLikesDislikesCount(commentID, type);
              return res.status(201).json('Video changed from disliked to liked');
            }
          } else if (!user) {
            const liked = new LikeDislikeCommentForm({
              userID,
              commentID,
              liked: true,
              disliked: false,
            });
    
            await liked.save();
            getLikesDislikesCount(commentID, type);
            return res.status(201).json("Video liked");
          }
        } else if (state === "dislike") {
          const user = await LikeDislikeCommentForm.findOne({ commentID, userID });
    
          if (user) {
            if (user.liked === false && user.disliked === true) {
              await LikeDislikeCommentForm.deleteOne({ commentID, userID });
                getLikesDislikesCount(commentID, type);
              return res.status(201).json("Video removed from dislikes");
            } else if (user.liked === true && user.disliked === false) {
              user.disliked = true;
              user.liked = false;
              await user.save();
              getLikesDislikesCount(commentID, type);
              return res.status(201).json('Video changed from liked to disliked');
            }
          } else if (!user) {
            const disliked = new LikeDislikeCommentForm({
              userID,
              commentID,
              liked: false,
              disliked: true,
            });
    
            await disliked.save();
            getLikesDislikesCount(commentID, type);
            return res.status(201).json("Feedback shared with creator");
          }
        }else if(state === 'check'){
          const user = await LikeDislikeCommentForm.findOne({ commentID, userID });
    
          if(user){
            if(user.liked === true){
              return res.status(201).json('liked')
            }else if(user.disliked === true){
              return res.status(201).json('disliked')
            }else{
              return res.status(201).json('neither')
            }
          }else if(!user){
            return res.status(201).json('nothing to show here')
          }
          }
    
          
    
        return res.status(400).json("Invalid state value");



    }catch(error){
      return  res.status(500).json('could not update likes', error)
    }

}

module.exports = LikeDislikecomment;