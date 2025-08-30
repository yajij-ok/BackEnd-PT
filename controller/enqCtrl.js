const asyncHandler = require("express-async-handler");
const Enquiry = require("../models/enqModel");

const addEnq = asyncHandler(async(req, res)=>{
try {
    const addedEnq = await Enquiry.create(req.body);
    res.json(addedEnq)
} catch (error) {
    throw new Error(error);
    
}
});

const getEnqs = asyncHandler(async(req, res)=>{
try {
        const allEnqs = await Enquiry.find();
        res.json(allEnqs);
} catch (error) {
    throw new Error(error);
    
}
});

const getAEnq = asyncHandler(async(req,res)=>{
    const {_id} = req.params;
    try {
        const enquiry = await Enquiry.exists(_id);
        res.json(enquiry);
    } catch (error) {
        throw new Error(error);
        
    }
});
 const updateEnq = asyncHandler(async(req, res)=>{
    const {_id} = req.params;
     try {
        const updateStatus = await Enquiry.findByIdAndUpdate(
            _id,
            req.body,
            {
                new: true
            }
        )
        res.json(updateStatus)
     } catch (error) {
        throw new Error(error);
        
     }
 })

const deleteEnq = asyncHandler(async(req,res)=>{
   const {_id} = req.params;
   try {
    const enquiry = await Enquiry.findOneAndDelete(_id)
    res.json({
        msg: "Enquiry deleted successfully"
    })
   } catch (error) {
    throw new Error(error);
    
   }
})

module.exports = {
    addEnq,
    getEnqs, 
    getAEnq, 
    deleteEnq,
    updateEnq
}