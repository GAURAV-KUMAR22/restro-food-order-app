import mongoose, { Schema } from "mongoose";

const complainSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Admin'
    }
})