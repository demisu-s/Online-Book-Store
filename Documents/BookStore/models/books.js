const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
    ,
    phone:{
        type:String,
        required:true
    },
    pdf:{
        type:String,
        required:true
    },
    created:{
        type:Date,
        required:true,
        default:Date.now
    },
})

module.exports=mongoose.model("Book",userSchema)