const express = require("express");
const { createUser, getUser, loginUser, getAllUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshtoken, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, updateOrderStatus, getAllOrders,  getOrder, getUserOrders, orderSingleProduct, cancelOrder, logoutUser } = require("../controller/userCtrl");

const { authMiddleWare, isAdmin } = require("../middleware/authMiddleware");


const authRouter= express.Router();

authRouter.get("/cart/get-cart",authMiddleWare, getUserCart)
authRouter.get("/get-orders/",authMiddleWare, getUserOrders)

authRouter.post('/register' , createUser)
authRouter.post('/login', loginUser);
authRouter.post("/logout", logoutUser)
authRouter.post('/forgot-password-token', forgotPasswordToken)
authRouter.put('/reset-password/:token', resetPassword)
authRouter.put('/update-password', authMiddleWare, updatePassword)
authRouter.get('/', authMiddleWare, getAllUser)
authRouter.get("/:id",authMiddleWare,  getUser)
authRouter.delete("/:id", deleteUser)
authRouter.put("/:id", updateUser);
authRouter.put("/save-address", saveAddress);
authRouter.post("/cart",authMiddleWare, userCart);

authRouter.delete("/empty-cart", authMiddleWare, emptyCart)
authRouter.post("/cart/applyCoupon", applyCoupon)
authRouter.post("/cart/cash-order",authMiddleWare, createOrder)
authRouter.post("/cash-order/:prodId", authMiddleWare, orderSingleProduct)
authRouter.put("/cancel-order/:id",authMiddleWare, cancelOrder)

authRouter.put("/user-block/:id",authMiddleWare,isAdmin, blockUser)
authRouter.put("/user-unblock/:id",authMiddleWare, isAdmin, unblockUser)
authRouter.get("/refresh", handleRefreshtoken)


// admin panel
authRouter.post('/admin-login',  loginAdmin);
authRouter.put("/order/update-order/:id",authMiddleWare, updateOrderStatus)
authRouter.get("/order/get-all-orders", authMiddleWare, getAllOrders)
authRouter.get("/order/order-details/:id", getOrder)

module.exports =authRouter;