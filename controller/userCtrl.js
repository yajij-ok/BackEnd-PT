const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");

const { v4: uuidv4 } = require('uuid')

const asyncHandler = require("express-async-handler");
const {generateToken, setAccessTokenCookie} = require("../config/JWToken");
const validateMongoDbId = require("../utils/validateMongoDBid");
const {generateRefreshToken, setRefreshTokenCookie} = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sentEmail = require("./emailCtrl");
const crypto = require("crypto");



const initializeApp = asyncHandler(async(req,res)=>{
    res.json({
        message: "App is runnig"
    })
})

const createUser = asyncHandler( async (req, res) =>{
    const email = req.body.email;
    const findUser = await User.exists({email:email})
    if(!findUser){
       const newUser = await User.create(req.body)
       res.json(newUser)
    }else{
      throw new Error("User already exists.");
      
       }
    }
       
)

const loginUser = asyncHandler(async(req,res)=>{
    const {email, password} = req.body;
    // if user exist

    const findUser = await User.findOne({ email });

    


    if(findUser && (await findUser.isPasswordMatched(password))){
        const refreshToken= generateRefreshToken(findUser?._id)
         setRefreshTokenCookie(res, refreshToken);

           const accessToken= generateToken(findUser?._id)
           setAccessTokenCookie(res, accessToken);

        const updateUser = await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken: refreshToken,
        },
        {
            new: true
        }
    );
    

    
       res.json({
        _id: findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        wishList: findUser?.wishList,
        token: accessToken,


       })
    }else{
        throw new Error("Invalid credential.")
    }
});

const loginAdmin = asyncHandler(async(req,res)=>{
    const {email, password} = req.body;
    // if user exist

    const findAdmin = await User.findOne({ email });

    if(findAdmin.role !== "admin") throw new Error("Not Authorized.");
    


    if(findAdmin && (await findAdmin.isPasswordMatched(password))){
        const refreshToken= generateRefreshToken(findAdmin?._id)
           setRefreshTokenCookie(res, refreshToken);

           const accessToken= generateToken(findAdmin?._id)
           setAccessTokenCookie(res, accessToken);

        const updateUser = await User.findByIdAndUpdate(
            findAdmin.id,
            {
                refreshToken: refreshToken,
        },
        {
            new: true
        }
    );
    
   
    
       res.json({
        _id: findAdmin?._id,
        firstname: findAdmin?.firstname,
        lastname: findAdmin?.lastname,
        email: findAdmin?.email,
        mobile: findAdmin?.mobile,
        token: accessToken

       })
    }else{
        throw new Error("Invalid credential.")
    }
})


const handleRefreshtoken = asyncHandler(async(req,res)=>{
    const cookie = req.cookies;

    if(!cookie?.refreshToken){
        throw new Error("No refresh Token found.");
        
    }
    const refreshToken= cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user){
        throw new Error("No refresh Token for this user.");
        
    }
   

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) =>{
     if(err || user.id !== decoded.id){
        throw new Error("There is something wrong with refresh Token.");
        
     }
     const accessToken = generateToken(user._id)
     res.json({accessToken})
    })
    

})

const getAllUser =asyncHandler( async (req,res)=>{
   try {
     const users = await User.find();
     res.json(users);
   } catch (error) {
    throw new Error(error)
    
   }
})


// logout handler  

const logoutUser = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) return res.sendStatus(204);

    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });

    if (user) {
        await User.findByIdAndUpdate(user._id, { refreshToken: "" });
    }

    res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.JWT_SECRET=== "production", sameSite: "strict" });
    res.clearCookie("accessToken", { httpOnly: true, secure: process.env.JWT_SECRET === "production", sameSite: "strict" });

    return res.sendStatus(204);
});

const getUser = async (req,res)=>{
       
         const {id} = req.params;
         validateMongoDbId(id)

         try {
          const findUser = await User.findById(id);
          if(findUser){
            res.json(findUser)
          }else{
            throw new Error("Invalid user");
            
          }
       } catch (error) {
        throw new Error(error)
       }
    }

    const deleteUser = asyncHandler(async(req,res)=>{
        const {id} = req.params;
        validateMongoDbId(id)

        try {
            const deleteUser = await User.findByIdAndDelete(id);
            res.json({
                msg: "user deleted successfully."
            })
            
        } catch (error) {
            throw new Error("Couldn't delete");
            
        }
    });

    const updateUser = asyncHandler(async(req,res)=>{
        const {id} = req.user._id;
        validateMongoDbId(id)
        try {

            const updateAUser = await findByIdAndUpdate(
                id, {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                mobile: req.body.mobile
            },
            {
                new: true,
            }
        );

     res.json(updateAUser);
            
        } catch (error) {
            throw new Error("Couldn't update user");
            
        }

    }); 

    // save user address
    const saveAddress = asyncHandler(async(req,res)=>{
        const {id} = req.user._id;
        validateMongoDbId(id)
        try {

            const updateAUser = await findByIdAndUpdate(
                id, {
                address: req?.body?.address,

            },
            {
                new: true,
            }
        );

     res.json(updateAUser);
            
        } catch (error) {
            throw new Error("Couldn't update user");
            
        }

    }); 

    const blockUser = asyncHandler(async(req,res)=>{
        const { id } = req.params;
        validateMongoDbId(id);
        try {

            const block = await User.findByIdAndUpdate(
                id,
                {
                    isBlocked : true,
                },
            {
                new: true
            }
            );
            res,json(
                {messsage: "user blocked"}
            )
            
        } catch (error) {
            throw new Error("error");
            
        }
    })


    
    const unblockUser = asyncHandler(async(req,res)=>{
        const { id } = req.params;
        validateMongoDbId(id)
        try {

            const unblock = await User.findByIdAndUpdate(
                id,
                {
                    isBlocked : false,
                },
            {
                new: true
            }
            );
            res,json(
                {messsage: "user unblocked"}
            )
            
        } catch (error) {
            throw new Error("error");
            
        }
    });

    const updatePassword = asyncHandler(async(req, res )=>{
        const {_id} = req.user;
        const {password} = req.body
        validateMongoDbId(_id);
        const user = await User.findById(_id);
        if (password) {
            user.password = password;
            const updatePassword = await user.save();
            res.json(updatePassword)
        } else {
            res.json(user)
        }
    })
    // forgot password

    const forgotPasswordToken = asyncHandler(async(req, res)=>{
         const {email} = req.body;
         const user = await User.findOne({email});
         if(!user) throw new Error("User not found.");
         
         try {
            const token = await user.createPasswordResetToken();
            await user.save();
            const resetUrl = `Hi, Please follow this link to reset your Password. This link will valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset.password/reset-password/${token}'> Click Here</a>`
        const data = {
            to: email,
            text: `Hey, ${user.firstname}`,
            subject: "Forgot Password Link",
            htm: resetUrl,

        } 
        sentEmail(data);
        res.json(token)
        } catch (error) {
            throw new Error(error);    
         }
    });

    // Reset password

    const resetPassword = asyncHandler(async(req, res)=>{
        const {password}= req.body;
        const { token } = req.params;

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
           passwordResetToken: hashedToken,
           passwordResetExpires: { $gt: Date.now()},

        });
        if(!user) throw new Error(" Token Expired. Please try again later");
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires=undefined;
        await user.save();
        res.json(user);
    });

    const userCart = asyncHandler(async(req, res)=>{
      const { cart } =  req.body;
      const {_id}  = req.user;
      try {
        let products =[]
        const user = await User.findById(_id);
        // check if user already have product in cart

        const alreadyExistCart = await Cart.findOne({orderedBy: user._id});
        if(alreadyExistCart) {
            //alreadyExistCart.remove()
            await Cart.findOneAndDelete({orderedBy: user._id})
        }
        for(let i = 0; i< cart?.length; i++){
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count || 1 ;
            object.color = cart[i].color || null;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price =  getPrice.price
            products.push(object)
            
        }
        let cartTotal = 0
        for(let i=0 ; i<products.length; i++){
            cartTotal = cartTotal + products[i].price * products[i].count
        }

        let newCart = await new Cart({
            products,
            cartTotal,
            orderedBy: user?._id,
        }).save()
        res.json(newCart)
      } catch (error) {
        throw new Error(error);
      }
    });

    const getUserCart = asyncHandler(async(req, res)=>{
        const {_id}  = req.user;
        console.log(_id);
        
        validateMongoDbId(_id);
        try {
            const userCart = await Cart.findOne({orderedBy: _id}).populate('products.product')
            res.json(userCart)
        } catch (error) {
            throw new Error(error);
            
        }
    });

    const emptyCart = asyncHandler(async(req, res)=>{
        const {_id}= req.user;
        validateMongoDbId(_id);
        try {
            const user = await User.findById({_id})
            const cart = await Cart.findOneAndRemove({orderedBy: user._id})
         
            res.json(cart)
        } catch (error) {
            throw new Error(error);
            
        }
    });

    const applyCoupon = asyncHandler(async(req, res)=>{
        const { coupon }= req.body;
        const { _id } = req.user
        validateMongoDbId(_id)
        try {
            const validCoupon = await Coupon.findOne({name: coupon})
            if(validCoupon === null){
                throw new Error("Invalid Coupon");
                
            }
            const user = await User.findById({ _id });

            let { cartTotal} = await Cart.findOne({
                orderedBy: user._id
            }).populate("products.product");
            let totalAfterDiscount = cartTotal - (cartTotal * validCoupon.discount/100).toFixed(2);
           
            await Cart.findOneAndUpdate(
                {orderedBy: user._id},
                {totalAfterDiscount},
                {new: true}
            )
            
            res.json(totalAfterDiscount)
        } catch (error) {
            throw new Error(error);
            
        }
    });

    const createOrder = asyncHandler(async(req,res)=>{
        const {couponApplied, phone, deliveryCharge , shippingAddress} = req.body;
        const { _id }= req.user
        validateMongoDbId(_id)
        try {
           // if(!COD){
             //   throw new Error("Create Cash Order Failed");
                
            // }
             const DC= parseInt(deliveryCharge)
            const user = await User.findById({_id});
            const userCart = await Cart.findOne({ orderedBy: user._id})
            let finalAmount = 0;
            if(couponApplied && userCart.totalAfterDiscount){
                finalAmount = parseInt(userCart.totalAfterDiscount) + DC
            }else{
                finalAmount = parseInt(userCart.cartTotal) + DC
            }

            let newOrder = await new Order({
                products: userCart.products,
                paymentIntent:{
                    id: uuidv4(),
                    method: "COD",
                    amount: finalAmount,
                    status: "Cash On Delivery",
                    created: Date.now(),
                    currency: "TK"
                },
                orderedBy: user._id,
                phone: phone,
                orderStatus: "Processing",
                shippingAddress: shippingAddress
            }).save();

            let update = userCart.products.map((item)=>{
                return {
                    updateOne:{
                        filter: { _id: item.product._id},
                        update: {$inc: {quantity: -item.count, sold: +item.count}}
                    }
                }
            });
            const updated = await Product.bulkWrite(update, {});
            res.json({
                message: "Order success"
            })
        } catch (error) {
            throw new Error(error);
            
        }
    });
    const orderSingleProduct = asyncHandler(async(req,res)=>{
        const {couponApplied, qty, phone, deliveryCharge , shippingAddress} = req.body;
        const {prodId} = req.params
        const { _id }= req.user
        validateMongoDbId(_id)
        try {
           // if(!COD){
             //   throw new Error("Create Cash Order Failed");
                
            // }
             const DC= parseInt(deliveryCharge)
             const quantity = parseInt(qty)

            const user = await User.findById({_id});
            const product = await Product.findById({_id:prodId})
            const userCart = await Cart.findOne({ orderedBy: user._id})
            let finalAmount = 0;
            if( product.price){
                finalAmount = parseInt(product.price)*quantity + DC
            }
            let newOrder = await new Order({
                products: [{
                    product: product,
                    count: qty,
                    color: ""
                }],
                paymentIntent:{
                    id: uuidv4(),
                    method: "COD",
                    amount: finalAmount,
                    status: "Cash On Delivery",
                    created: Date.now(),
                    currency: "TK"
                },
                orderedBy: user._id,
                phone: phone,
                orderStatus: "Processing",
                shippingAddress: shippingAddress
            }).save();

            let update = userCart.products.map((item)=>{
                return {
                    updateOne:{
                        filter: { _id: item.product._id},
                        update: {$inc: {quantity: -item.count, sold: +item.count}}
                    }
                }
            });
            const updated = await Product.bulkWrite(update, {});
            res.json({
                message: "Order success"
            })
        } catch (error) {
            throw new Error(error);
            
        }
    });
    const getUserOrders = asyncHandler(async(req, res)=>{
      const { _id } = req.user
      validateMongoDbId(_id);
      try {
        const userOrder = await Order.find({orderedBy: _id}).populate("products.product");
        res.json(userOrder)
      } catch (error) {
        throw new Error(error);
        
      }
    });
 const getOrder = asyncHandler(async(req, res)=>{
      const { id } = req.params
      validateMongoDbId(id);
      try {
        const userOrder = await Order.findOne({_id:id}).populate("products.product");
        res.json(userOrder)
      } catch (error) {
        throw new Error(error);
        
      }
    });

   const getAllOrders = asyncHandler(async(req, res)=>{
      try {
        const orders = await Order.find().populate("products.product");
        res.json(orders)
      } catch (error) {
        throw new Error(error);
        
      }
    });

    const updateOrderStatus = asyncHandler(async(req, res)=>{
        const { status }= req.body;
        const { id }= req.params;
        validateMongoDbId(id);
        try {
            const updatedOrderStatus = await Order.findByIdAndUpdate(
                { _id:id},
                {orderStatus: status},
                //{paymentIntent:{
                  //  status: status
               // }},
                {
                    new: true
                }
            )
            res.json(updatedOrderStatus)
        } catch (error) {
            throw new Error(error);
            
        }
    })

 const cancelOrder = asyncHandler(async(req, res)=>{
        const { id }= req.params;
        validateMongoDbId(id);
        try {
            const updatedOrderStatus = await Order.findByIdAndUpdate(
                { _id:id},
                {orderStatus: "Canceled"},
                //{paymentIntent:{
                  //  status: status
               // }},
                {
                    new: true
                }
            )
            res.json(updatedOrderStatus)
        } catch (error) {
            throw new Error(error);
            
        }
    })

module.exports = {
    createUser,
    loginUser,
     getAllUser,
     getUser,
     deleteUser,
     updateUser,
     blockUser,
      unblockUser,
      handleRefreshtoken,
      logoutUser,
      updatePassword,
      forgotPasswordToken,
       resetPassword,
       loginAdmin,
       saveAddress,
       userCart,
       getUserCart,
       emptyCart,
       applyCoupon,
       createOrder,
       orderSingleProduct,
       getUserOrders,
       updateOrderStatus,
       getAllOrders,
       getOrder,
       cancelOrder,
       initializeApp
    };
