const Video = require("../videomodel");
const LikeDislike = require("./likedislikemodel");

const getLikesDislikesCount = async (videoID) => {
  const likesCount = await LikeDislike.countDocuments({ videoID, liked: true });
  const dislikesCount = await LikeDislike.countDocuments({ videoID, disliked: true });

  const filter = { UniqueID: videoID };
  const update = { likes: likesCount, dislikes: dislikesCount };

  await Video.updateOne(filter, update);

  console.log('video stat updated');
};

const likeDislike = async (req, res) => {
  try {
    const { videoID, userID, state } = req.body;

    if (state === "like") {
      const user = await LikeDislike.findOne({ videoID, userID });
      if (user) {
        if (user.disliked === false && user.liked === true) {
          await LikeDislike.deleteOne({ videoID, userID });
          getLikesDislikesCount(videoID);
          return res.status(201).json("Video removed from liked videos");
        } else if (user.disliked === true && user.liked === false) {
          user.disliked = false;
          user.liked = true;
          await user.save();
          getLikesDislikesCount(videoID);
          return res.status(201).json('Video changed from disliked to liked');
        }
      } else if (!user) {
        const liked = new LikeDislike({
          userID,
          videoID,
          liked: true,
          disliked: false,
        });

        await liked.save();
        getLikesDislikesCount(videoID);
        return res.status(201).json("Video liked");
      }
    } else if (state === "dislike") {
      const user = await LikeDislike.findOne({ videoID, userID });

      if (user) {
        if (user.liked === false && user.disliked === true) {
          await LikeDislike.deleteOne({ videoID, userID });
            getLikesDislikesCount(videoID);
          return res.status(201).json("Video removed from dislikes");
        } else if (user.liked === true && user.disliked === false) {
          user.disliked = true;
          user.liked = false;
          await user.save();
          getLikesDislikesCount(videoID);
          return res.status(201).json('Video changed from liked to disliked');
        }
      } else if (!user) {
        const disliked = new LikeDislike({
          userID,
          videoID,
          liked: false,
          disliked: true,
        });

        await disliked.save();
        getLikesDislikesCount(videoID);
        return res.status(201).json("Feedback shared with creator");
      }
    }else if(state === 'check'){
      const user = await LikeDislike.findOne({ videoID, userID });

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
  } catch (error) {
    return res.status(500).json("Could not update likes", error);
  }
};

module.exports = likeDislike;
