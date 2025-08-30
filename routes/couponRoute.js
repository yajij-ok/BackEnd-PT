const express = require("express");
const { addCoupon, getCoupons, getACoupon, deleteCoupon } = require("../controller/couponCtrl");

const couponRouter = express.Router();

couponRouter.post("/", addCoupon)
couponRouter.get("/", getCoupons)
couponRouter.get("/:_id", getACoupon)
couponRouter.delete("/:_id", deleteCoupon)

module.exports = couponRouter