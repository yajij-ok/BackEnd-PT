const slugify= require("slugify");
const asyncHandler = require("express-async-handler");

const Category = require("../models/categoryModel");


const createCategory = asyncHandler(async(req,res)=>{
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
            const newCategory = await Category.create(req.body)
            res.json(newCategory)
        }
    } catch (error) {
        throw new Error(error);
        
    }
})
const getCategories = asyncHandler(async(req, res)=>{
    try {

        const allCategory = await Category.find()
        res.json(allCategory)
        
    } catch (error) {
        throw new Error(error);   
    }
});
const getACategory = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try {
        const getCategory = await Category.exists({_id:id})

        if(!getCategory){
            throw new Error("Couldn't find a category with this name");
            
        }else{
            res.json(getCategory)
        }
    } catch (error) {
        throw new Error(error);
        
    }
});
const deleteCategory = asyncHandler(async(req,res)=>{
    const {id}= req.params;
    try {
        const deletedCategory = await Category.findOneAndDelete({_id:id})
        if(!deleteCategory){
            throw new Error("Couldn't delete the Category as it's doesn't exist.");
            
        }else{
            res.json({
                msg: "Category deleted succesfully."
            })
        }
    } catch (error) {
        throw new Error(error);
        
    }
});

const updateCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const updatedCategory = await Category.findOneAndUpdate(
            {_id: id},
            req.body,
            {
                new: true
            }
        )
        res.json(updatedCategory)
    } catch (error) {
        throw new Error(error);
        
    }
});


module.exports = {
    createCategory,
    getCategories,
    getACategory,
    deleteCategory,
    updateCategory
}