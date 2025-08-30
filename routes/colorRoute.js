const express = require("express");
const {addColor, getColors, getAColor, deleteColor} = require("../controller/colorCtrl");
const colorRoute = express.Router();

colorRoute.post("/", addColor)
colorRoute.get("/", getColors)
colorRoute.get("/:_id", getAColor)
colorRoute.delete("/:_id", deleteColor)

module.exports = colorRoute