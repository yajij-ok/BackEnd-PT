const {mongoose, model} = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
const crypto = require("crypto")

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    
    },
    lastname:{
        type:String,
        required:true,
       
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:false,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type: String,
        default: "user"
    },
    isBlocked: {
     type: Boolean,
     default: false
    },
    cart:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }],
    address: {
        type: String
    },
    wishList : [{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Product"
    }],
    refreshToken:{
        type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
},
{
    Timestamp: true
} 
);

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        next()
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
}

userSchema.methods.createPasswordResetToken = async function(){
    const resettoken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");

    this.passwordResetExpires = Date.now() + 30* 60* 1000;
    return resettoken;
}

//Export the model
const User= model("Users", userSchema);

module.exports = User;  