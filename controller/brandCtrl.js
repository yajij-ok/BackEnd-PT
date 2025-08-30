const asyncHandler = require("express-async-handler");
const Brand = require("../models/brandModel");

const addBrand = asyncHandler(async(req,res)=>{
   
    try {
        const newBrand = await Brand.create(req.body)
        res.json(newBrand)
    } catch (error) {
        throw new Error(error);  
    }
});

const getBrands = asyncHandler(async(req, res)=>{
try {
        const allBrands = await Brand.find();
        res.json(allBrands);
} catch (error) {
    throw new Error(error);
    
}
});

const getABrand = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try {
        const brand = await Brand.exists({_id: id}).populate("title");
        res.json(brand);
    } catch (error) {
        throw new Error(error);
        
    }
})

const deleteBrand = asyncHandler(async(req,res)=>{
   const {id} = req.params;
   try {
    const brand = await Brand.findOneAndDelete({_id: id})
    res.json({
        msg: "Brand deleted successfully"
    })
   } catch (error) {
    throw new Error(error);
    
   }
})

const updateBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try {
       
        const updatedBrand = await Brand.findOneAndUpdate(
            {_id: id},
            req.body,
            {
                new: true
            }
        )
        res.json(updatedBrand)
    } catch (error) {
        throw new Error(error);
        
    }
});


module.exports = {
    addBrand,
    getBrands,
    getABrand,
    deleteBrand,
    updateBrand
}