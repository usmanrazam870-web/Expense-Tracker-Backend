const mongoose=require('mongoose')

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_DB)
    console.log("Connected to DB")
    }
    catch(err)
    {
        console.log("Connection Error",err)
    }
}
module.exports=connectDB