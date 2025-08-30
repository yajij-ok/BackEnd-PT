const express = require("express")
const { addBrand, getBrands, getABrand, deleteBrand, updateBrand } = require("../controller/brandCtrl")
const { authMiddleWare, isAdmin } = require("../middleware/authMiddleware")

const brandRouter = express.Router()

brandRouter.post("/",authMiddleWare, addBrand)
brandRouter.get("/", getBrands)
brandRouter.get("/:id", getABrand)
brandRouter.put("/:id", authMiddleWare,  updateBrand)
brandRouter.delete("/:id", deleteBrand)

module.exports = brandRouter