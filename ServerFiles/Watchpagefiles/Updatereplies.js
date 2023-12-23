const RepliesForm = require("./repliesmodel");


const UpdateReplies = async(req, res) =>{

    const {editedReply, replyID} = req.body
    try{

        const reply = await RepliesForm.findOne({replyID})

        reply.comment = editedReply

        await reply.save()
        res.status(200).json('reply updated')


    }catch(error){
        res.status(500).json('could not update reply', error)
    }
}

module.exports = UpdateReplies