const setAccessTokenCookie = (res, accessToken)=>{
    res.cookie('accessToken', accessToken,{
        maxAge: 2* 24 * 60* 60 * 1000, // 2 days
        httpOnly: true,
        //secure: true,
        sameSite: 'none',
     });

}
const setRefreshTokenCookie = (res, refreshToken)=>{
    res.cookie('refreshToken', refreshToken,{
        maxAge: 7* 24 * 60* 60 * 1000, // 7 days
        httpOnly: true,
       // secure: true,
        sameSite: 'none',
     });
}

module.exports = {setAccessTokenCookie, setRefreshTokenCookie};