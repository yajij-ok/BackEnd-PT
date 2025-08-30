const { default: mongoose } = require("mongoose");



const dbConnect = async() =>{
   try {
   await mongoose.connect( "mongodb+srv://riazarafat85:yajij%40732@cluster0.dlwkj.mongodb.net/mern-project");
   console.log("MongoDB is connected");
   
    mongoose.connection.on('error' , (error)=>{
        console.error('MongoDb connection error' , error);
    });
    
   } catch (error) {
    console.error('couldnt connect to DataBase' , error);
   }
}

module.exports = dbConnect;