const CommentsForm = require("./commentModel");

const RetreiveCommentsandReplies = async (req, res) =>{

    const {videoID, state} = req.body
    console.log(videoID)
    try{

        if(state === 'retrievecomments'){
            const comments = await CommentsForm.find({videoID})

            if(comments){
                res.status(200).json(comments)
            } else{
                let nocomments = []
                res.status(200).json(nocomments)
            }
           
        }
        


    }catch(error){
        res.status(500).json('could not get comments', error)
    }
}
module.exports = RetreiveCommentsandReplies;