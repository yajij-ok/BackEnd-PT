const asyncHandler = require("express-async-handler");
const Color = require("../models/colorModel");

const addColor = asyncHandler(async(req, res)=>{
try {
    const addedColor = await Color.create(req.body);
    res.json(addedColor)
} catch (error) {
    throw new Error(error);
    
}
});

const getColors = asyncHandler(async(req, res)=>{
try {
        const allColors = await Color.find();
        res.json(allColors);
} catch (error) {
    throw new Error(error);
    
}
});

const getAColor = asyncHandler(async(req,res)=>{
    const {_id} = req.params;
    try {
        const Color = await Color.exists(_id);
        res.json(Color);
    } catch (error) {
        throw new Error(error);
        
    }
})

const deleteColor = asyncHandler(async(req,res)=>{
   const {_id} = req.params;
   try {
    const Color = await Color.findOneAndDelete(_id)
    res.json({
        msg: "Color deleted successfully"
    })
   } catch (error) {
    throw new Error(error);
    
   }
})

module.exports = {
    addColor,
    getColors, 
    getAColor, 
    deleteColor 
}