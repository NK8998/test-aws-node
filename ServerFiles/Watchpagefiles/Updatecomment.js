const CommentsForm = require("./commentModel")

const UpdateComment = async(req, res) =>{

    const {updatedComment, commentID} = req.body


    try{
        const comment = await CommentsForm.findOne({commentID})
        if(comment){
            comment.comment = updatedComment

            await comment.save()
            res.status(200).json('comment updated')
        }

    }catch(error){
        res.status(500).json('could not update comment', error)
    }
}

module.exports = UpdateComment;