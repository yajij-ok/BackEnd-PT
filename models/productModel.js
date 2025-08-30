const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique: true,
        trim: true
    },
    slug:{
        type:String,
        required:true,
        unique: true,
        lowercase: true
    },
    description:{
        type: String,
        required:true,
        unique: false

    },
    price:{
        type: Number,
        required: true,
        unique: false
    },
    category:{
        type: String,
        ref: "Category"
    },
    brand:{
        type:String,
       ref: "Brand"
    },
    quantity:{
        type: Number,      
    },
    sold:{
        type: Number,
        default:0,
        select: false
    },
    images: [],
    color:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Color"
    }],
    tags: [],
    ratings:[{
        star: Number,
        comment: String,
        postedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    totalRatings :{
        type: String,
        default: "0"
    }

},
{timestamps: true});

//Export the model
module.exports = mongoose.model('Product', productSchema);