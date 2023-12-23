const RepliesForm = require("./repliesmodel");

const GetReplies = async (req, res) =>{

    const {parentID} = req.body
    try{

        const replies = await RepliesForm.find({parentID})

        if(replies){
            res.status(200).json(replies)
        }else {
            return res.status(200).json([])
        }

    }catch(error){
        res.status(500).json('could not get replies', error)
    }
}

module.exports = GetReplies;