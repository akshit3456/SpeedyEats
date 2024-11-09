import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://greatstack:04022004@cluster0.6vix4.mongodb.net/food-del').then(()=>console.log("DB connected"))

}