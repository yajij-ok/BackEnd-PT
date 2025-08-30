
const cloudinary = require("cloudinary")



    // Configuration
    cloudinary.config({ 
        cloud_name: "dh5blne7f", 
        api_key: "373299319487943",
        api_secret: "XUuehBjDsfmDeDDgVHAPUzn7aMY" // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
    const cloudinaryUploadImg =async (file) =>{
       return new Promise((resolve)=>{
        cloudinary.uploader.upload(file, (result)=>{
            resolve(
                {
                    url: result.secure_url
                },
                {
                    resource_type: "auto"
                }
            )
        })
       })
    }
