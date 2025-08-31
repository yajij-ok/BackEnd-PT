const jwt = require ('jsonwebtoken')

const generateToken =(id) =>{
    return jwt.sign({id }, process.env.JWT_SECRET, {expiresIn: "3d"});
}
const isProduction = process.env.NODE_ENV === "production";
const setAccessTokenCookie = (res, token) => {
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
         path: "/",
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
};
module.exports = {
    generateToken,
    setAccessTokenCookie
}
