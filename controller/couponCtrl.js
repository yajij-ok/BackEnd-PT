const asyncHandler = require("express-async-handler");
const Coupon = require("../models/couponModel");

const addCoupon = asyncHandler(async(req,res)=>{
    try {
        const newCoupon = await Coupon.create(req.body)
        res.json(newCoupon)
    } catch (error) {
        throw new Error(error);
        
    }
});

const getCoupons = asyncHandler(async(req,res)=>{
    try {
        const allCoupons = await Coupon.find()
        res.json(allCoupons)
    } catch (error) {
        throw new Error(error);
        
    }
})

const getACoupon = asyncHandler(async(req,res)=>{
    const { _id } = req.params
    try {
        const coupon = await Coupon.findById(_id)
        res.json(coupon)
    } catch (error) {
        throw new Error(error);
        
    }
})

const deleteCoupon = asyncHandler(async(req,res)=>{
    const { _id } = req.params
    try {
        const deleteCoupon = await Coupon.findByIdAndDelete(_id)
        res.json({
            msg: "Coupon deleted successfully."
        })
    } catch (error) {
        throw new Error(error);
        
    }
})


module.exports = {
    addCoupon,
    getCoupons,
    getACoupon,
    deleteCoupon
}