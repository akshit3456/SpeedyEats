import userModel from '../models/userModel.js';

// add items to user cart

const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        // Validate request data
        if (!userId || !itemId) {
            return res.status(400).json({ success: false, message: "Missing userId or itemId" });
        }

        // Find user
        let userData = await userModel.findOne({ _id: userId });
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData;

        cartData[itemId] = (cartData[itemId] || 0) + 1;

        const updatedUser = await userModel.findByIdAndUpdate(userId,{cartData})

        if (!updatedUser) {
            return res.status(500).json({ success: false, message: "Failed to update cart" });
        }

        res.json({ success: true, message: "Added to cart"});
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};




// remove items to user cart

const removeFromCart = async(req,res) =>{
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;

        if (cartData[req.body.itemId]>0){
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success: true, message: "Removed From Cart"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"});
    }

}

// fetch user cart data

const getCart = async(req,res) =>{
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;
        res.json({success: true, cartData});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}

export {addToCart,removeFromCart,getCart};