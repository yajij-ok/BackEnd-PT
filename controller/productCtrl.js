const slugify = require("slugify");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const {cloudinaryUploadImg, cloudinaryDeleteImg} = require("../config/cloudinary");
const fs = require("fs")

// Add Product
const addProduct =asyncHandler(async(req, res)=>{
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = (await Product.create(req.body)).populate("color")
        res.json(newProduct)
    } catch (error) {
        throw new Error(error);
        
    }
})

// get a product

const getaProduct = asyncHandler(async(req, res)=>{
  const {_id} = req.params
    try {
        const getaProduct = await Product.findById(_id).populate("color")
        res.json(getaProduct)
    } catch (error) {
        throw new Error(error);
        
    }
})

// get all products
const getAllProduct = asyncHandler(async (req, res) => {
  try {
    // 1. Filtering (except reserved fields)
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields", "keyword"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let filter = JSON.parse(queryStr);

    // 2. Search by keyword
    if (req.query.keyword) {
      const keyword = req.query.keyword;
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { brand: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
      ];
    }

    let query = Product.find(filter);

    // 3. Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // 4. Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // 5. Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // 6. Execute query
    const products = await query;

    // 7. Always return results, even if empty
    const total = await Product.countDocuments(filter);
    res.json({
      success: true,
      count: products.length,
      total,
      data: products,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// product suggestion on typing in search bar

const getProductSuggestions = asyncHandler(async (req, res) => {
  try {
    const keyword = req.query.keyword;
    console.log(keyword);
    

    if (!keyword) {
      return res.json({ success: true, data: [] });
    }

    // Search only in product "name" (you can add brand/category if you want)
    const suggestions = await Product.find({
      $or:[
     {title: { $regex: keyword, $options: "i" }},
      {brand: { $regex: keyword, $options: "i" }},
      {category: { $regex: keyword, $options: "i" }},
    ]
    })
      .select("title brand category price images")// return only these fields
      .limit(10); // limit suggestions

    res.json({
      success: true,
      count: suggestions.length,
      data: suggestions,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});


const updateProduct =  asyncHandler(async(req, res)=>{
   const {slug} = req.params
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }

        const  updateProduct = await Product.findOneAndUpdate(
            {slug},
            req.body,{
                new: true
            }
        ).populate("category")

res.json(updateProduct)
        
    } catch (error) {
        throw new Error(error);
        
    }
});

const deleteProduct =  asyncHandler(async(req, res)=>{
    const {id} = req.params
 try{
     const  deletedProduct = await Product.findOneAndDelete({_id:id})
 
 res.json("Product deleted successfully")
         
     } catch (error) {
         throw new Error(error);
         
     }
 });

 const addToWishlist =  asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    const {prodId} = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyAdded = await user.wishList.find((id) => id.toString() === prodId)

        if(alreadyAdded){
            let user = await User.findByIdAndUpdate(_id, {
                $pull : { wishList : prodId },
            },
        {
            new: true,
        }
        );
        res.json(user);
        }else{
            let user = await User.findByIdAndUpdate(_id, {
                $push : { wishList : prodId },
            },
        {
            new: true,
        }
        );
        res.json(user);
        }
    } catch (error) {
        throw new Error(error);
        
    }
 });

 const getWishlist = asyncHandler(async(req,res)=>{
    const { _id } = req.user;
    try {
   const getUser = await User.findById(_id).populate("wishList");
   res.json(getUser);
 } catch (error) {
    throw new Error(error);
 }
 })

const addToCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId, color, count } = req.body;

  try {
    const user = await User.findById(_id);
    if (!user) throw new Error("User not found");

    let userCart = await Cart.findOne({ orderedBy: _id });

    const product = await Product.findById(prodId).select("price");
    if (!product) throw new Error("Product not found");

    const quantity = count || 1
    const productToAdd = {
      product: prodId,
      count: quantity,
      color: color || null,
      price: product.price,
    };

    if (userCart) {
      const alreadyAdded = userCart.products.find(
        (item) => item.product.toString() === prodId
      );

      if (alreadyAdded) {
        return res.json({ msg: "The item is already in the cart" });
      }

      userCart.products.push(productToAdd);

      userCart.cartTotal = userCart.products.reduce(
        (sum, item) => sum + (item.count * item.price),
        0
      );
      await userCart.save();

      const updatedCart = await Cart.findById(userCart._id).populate("products.product");
      return res.json(updatedCart);
    } else {
      const newCart =  new Cart({
        products: [productToAdd],
        orderedBy: _id,
      })
         newCart.cartTotal = quantity * product.price;
      
         await newCart.save()

      const populatedCart = await Cart.findById(newCart._id).populate("products.product");
      return res.json(populatedCart);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const removeFromCart = asyncHandler(async(req,res)=>{
    const {_id} = req.user
    const {prodId} = req.body
        
    try {
        const cart = await Cart.findOne({orderedBy: _id});
        if (!cart) {
            return res.status(404).json({ msg: "Cart not found" });
        }
        cart.products= cart.products.filter((i)=>{
    const matchProduct = i.product.toString()===prodId
    return (!matchProduct)
        });
        
     cart.cartTotal = cart.products.reduce(
      (sum, item) => sum + (item.count * item.price),
      0
    );
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("products.product");
    res.json(updatedCart);

    } catch (error) {
        throw new Error
    }
})

const updateProdCount = asyncHandler (async(req, res)=>{
   const {_id} = req.user
   const {prodId} = req.params
   const {newCount} = req.body
    try {
        const cart = await Cart.findOne({orderedBy: _id});
        if (!cart) {
            return res.status(404).json({ msg: "Cart not found" });
        }
          let productFound = false;
    cart.products = cart.products.map((item) => {
      if (item.product.toString() === prodId) {
        productFound = true;
        return { ...item._doc, count: newCount }; 
      }
      return item;
    });

    if (!productFound) {
      return res.status(404).json({ msg: "Product not found in cart" });
    }

    cart.cartTotal = cart.products.reduce(
      (total, item) => total + item.price * item.count,
      0
    );

    await cart.save();
   return res.status(200).json(cart);
        
    } catch (error) {
         throw new Error
    }
})

 const ratings = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    const {prodId, comment} = req.body;
    try {
        const product = await Product.findById(prodId)
        const alreadyRated = product.ratings.find( (userId)=> userId.postedBy.toString=== _id.toString() )

        if(alreadyRated){
           const updateRating = await Product.updateOne(
            {
                ratings: { $elemMatch: alreadyRated},
            },
            {
                $set: { "ratings.$.star" : req.body.star, "ratings.$.comment" : comment}
            },
            {
                new: true
            }
           );
            res.json(updateRating)
        }else{
            let product = await Product.findByIdAndUpdate(
                {prodId},
                {
                 $push:{ 
                       ratings:{
                        star: req.body,
                        comment: comment,
                        postedBy:_id
                    }}
                },
                {
                    new:true
                }
               )
              
        }

        const getAllRatings = await Product.findById(prodId);
        let totalRatings = getAllRatings.ratings.length
        let ratingSum = getAllRatings.ratings.map((item) => item.star).reduce((prev, curr)=> prev + curr, 0);
        let actualRating = Math.round(ratingSum / totalRatings);
        const finalproduct = await Product.findByIdAndUpdate(
            prodId,
            {
                totalRatings: actualRating,
            },
            {
                new: true
            }
        );
        res.json(finalproduct)
    } catch (error) {
        throw new Error(error);
        
    }
 });

 const uploadProdImg = asyncHandler(async(req,res)=>{

    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files){
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath);
            fs.unlinkSync(path)
        }
   
           const images = urls.map((file)=>{
                return file
            })
    res.json(images)  

    } catch (error) {
        throw new Error(error);
        
    }
    
 });

 // delete image
 const deleteProdImg = asyncHandler(async(req,res)=>{
   const { id }  = req.params // public id
     try {
        const deleteImage =  cloudinaryDeleteImg(id, "images");
       
    res.json({message: "Deleted"})
    } catch (error) {
        throw new Error(error);
        
    }
    
 });

module.exports = {
     addProduct,
     getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishlist,
    ratings,
    uploadProdImg,
    deleteProdImg,
    addToCart,
    getWishlist,
    removeFromCart,
    updateProdCount,
    getProductSuggestions
 }