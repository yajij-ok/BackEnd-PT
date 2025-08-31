const jwt = require ('jsonwebtoken')

const generateToken =(id) =>{
    return jwt.sign({id }, process.env.JWT_SECRET, {expiresIn: "3d"});
}

const setAccessTokenCookie = (res, token) => {
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.JWT_SECRET=== "production",
        sameSite: "None",
         path: "/",
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
};
module.exports = {
    generateToken,
    setAccessTokenCookie
}
