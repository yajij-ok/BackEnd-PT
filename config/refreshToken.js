const jwt = require("jsonwebtoken");

const generateRefreshToken = (id)=>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: "15m"} );
}
const setRefreshTokenCookie = (res, token) => {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: process.env.JWT_SECRET === "production",
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};
module.exports = { 
                  generateRefreshToken, 
                  setRefreshTokenCookie
                }
