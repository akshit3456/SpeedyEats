import foodModel from "../models/foodModel.js";
import fs from 'fs';


// add food item

const addFood = async (req,res)=>{
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename,
        rating:req.body.rating,
        kind:req.body.kind,
        location:req.body.location,
    })
    try {
        await food.save();
        res.json({success:true,message:"Food Added"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"});
    }
}

// all food list

const listfood = async(req,res)=>{
    try {
        const {location}=req.query;
        if(!location)
        {
            const foods = await foodModel.find({});
            return res.json({success:true,data:foods}) 
        }
        const foods = await foodModel.find({location});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:'Errors'})
    }
}

// remove food list

const removeFood = async(req,res)=>{
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:'Food Removed'});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:'Error'});
    }
}

export {addFood,listfood,removeFood}