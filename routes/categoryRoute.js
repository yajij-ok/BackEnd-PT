const express = require("express");
const { getCategories, getACategory, deleteCategory, updateCategory, createCategory } = require("../controller/categoyCtrl");
const { authMiddleWare, isAdmin } = require("../middleware/authMiddleware");

const categoryRoute = express.Router();

categoryRoute.post("/", authMiddleWare, createCategory)
categoryRoute.get("/",  getCategories);
categoryRoute.get("/:id", getACategory);
categoryRoute.delete("/:id", authMiddleWare, deleteCategory);
categoryRoute.put("/:id", authMiddleWare, updateCategory)
module.exports = categoryRoute