const { default: mongoose } = require("mongoose")


const validateMongoDbId = (id) =>{
    const validId = mongoose.Types.ObjectId.isValid(id);
    if(!validId) throw new Error("This id is not a valid.");
    
};

module.exports = validateMongoDbId