const jwt = require('jsonwebtoken');

const signToken = id => { 
    return jwt.sign({ id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE_IN})
}
const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)
    const cookieOption = {
    expires: new Date(Date.now()+ process.env.JWT_COOKIS_EXPIRE_IN * 24 * 60 * 60 * 100),
    httpOnly: true
    }
    if (process.env.NODE_ENV == "pro") cookieOption.secure = true;
    res.cookie('jwt', token, cookieOption)
    user.password = undefined
    res.status(statusCode).json({
    status: "successful",
    token,
    data:{
    user
    }
   })
}

module.exports = createAndSendToken;