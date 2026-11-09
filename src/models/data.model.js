const mongoose=require('mongoose')

const dataSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'user' 
        }

},
{
    timestamps:true
})
const dataModel=mongoose.model("expense",dataSchema)
module.exports=dataModel