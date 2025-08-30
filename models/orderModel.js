const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            count: Number,
            color: String,
        }
    ],
    paymentIntent:{},
    orderStatus: {
        type: String,
        default: "Not Processed",
        enum: [
            "Not Processed",
            "Processing",
            "Dispatched",
            "Canceled",
            "Shipping",
            "Delivered"
        ],
    },
    orderedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
phone:{
  type: String
},
    shippingAddress:{
        type: String,
        required: true
    }
},
{
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);