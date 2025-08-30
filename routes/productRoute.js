const express = require("express");
const { addProduct, getaProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist, ratings, uploadProdImg, deleteProdImg, addToCart, getWishlist, removeFromCart, updateProdCount, getProductSuggestions } = require("../controller/productCtrl");
const { isAdmin, authMiddleWare } = require("../middleware/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middleware/uploadImages");

const productRouter = express.Router();

productRouter.get("/wishlist/", authMiddleWare, getWishlist);
productRouter.put("/wishlist", authMiddleWare, addToWishlist);
productRouter.put("/cart/remove", authMiddleWare, removeFromCart)
productRouter.put("/cart/:prodId", authMiddleWare, updateProdCount)

productRouter.post("/", addProduct);
productRouter.post("/upload/", uploadPhoto.array("images", 12), productImgResize, uploadProdImg)
productRouter.get("/", getAllProduct);
productRouter.get("/search/", getProductSuggestions);
productRouter.get("/:_id", getaProduct);
productRouter.put("/:slug", updateProduct);


productRouter.delete("/:id",  deleteProduct);
productRouter.delete("/delete-img/:id",deleteProdImg);


productRouter.post("/add-to-cart", authMiddleWare, addToCart);
productRouter.put("/rating", ratings);
module.exports = productRouter