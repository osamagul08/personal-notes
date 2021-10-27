const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const AppError = require('../utils/appError');
const User = require('../model/userModel');
const sendEmail = require('../utils/email');
const catchAsync = require('../utils/catchAsync');
const createAndSendToken = require('../utils/createAndSendToken');
const createObject = require('../utils/createUser');
const createHashToken = require('../utils/createHashToken');
const responseHelper = require('../utils/responseHelper');

exports.signup = catchAsync( async (req, res, next) => {
    const newUser = createObject(req, next);
    const user = await User.create(newUser);
    const resetUrl = `${req.protocol}://${req.get('host')}/user/verification/${newUser['resetToken']}`
    const message = `forgotpassword pleas click on link ${resetUrl}`;
   try {
    await sendEmail({
      email: user.email,
      subject: 'link expire after 10 mints',
      message
    })
    responseHelper(res, 'success', 200, 'email send')
   } catch (error) {
     user.passwordResetToken = undefined;
     user.passwordResetExpire = undefined;
    await user.save({validateBeforeSave:false})//ignore validation
    console.log(error)
    next(new AppError('email not send pleas try agaian later'))
   }
});

exports.verification = catchAsync(async (req, res, next) => {
  const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const currentUser = await User.findOne({ passwordSignupToken: hashToken, passwordResetExpire:{ $gt: Date.now()}})
  if (!currentUser) {
    return responseHelper(res, 'fial', 404, 'token expire or invalide token');
  }
  currentUser.passwordSignupToken = undefined;
  currentUser.passwordResetExpire = undefined;
  currentUser.active = true;
  await currentUser.save({validateBeforeSave:false})
  createAndSendToken(currentUser, 200, res)
});

exports.resend = catchAsync(async (req, res, next) => {
  const currentUser = await User.findOne({email: req.body.email});
  const tokenObject = createHashToken();
  currentUser.passwordSignupToken = tokenObject['passwordSignupToken'];
  currentUser.passwordResetExpire = tokenObject['passwordResetExpire'];
  currentUser.active = false;
  await currentUser.save({validateBeforeSave:false})
  const resetUrl = `${req.protocol}://${req.get('host')}/user/verification/${tokenObject['resetToken']}`
  const message = `forgotpassword pleas click on link ${resetUrl}`;
  try {
    await sendEmail({
      email: currentUser.email,
      subject: 'password expire after 10 mints',
      message             
    })
    responseHelper(res, 'success', 200, 'email send')
  } catch (error) {
      currentUser.passwordSignupToken = undefined;
      currentUser.passwordResetExpire = undefined;
      await currentUser.save({validateBeforeSave:false})//ignore validation
      next(new AppError('email not send pleas try agaian later'))                             
    }
})

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return next(new AppError('email or password not empty', 401))
  }
  //second we check user and password are exist 
  //select('+password') we can explictly allow the password field to be returned in your find call as follows
  const user = await User.findOne({email:email, active:true}).select('+password');
  if (!user) {
    return next(new AppError('email not exist'))
  }
  if (!(await user.checkUserAttamp( user.userattamp))) {
    return next(new AppError("You’ve reached the maximum logon attempts, this is email block"))
  }
  if (!(await user.checkPassword(password, user.password))) {
    user.userattamp = user.userattamp + 1;
    user.save({validateBeforeSave:false});
    return next(new AppError("Please enter correct  password"))
  }
  await User.findByIdAndUpdate(user.id, {userattamp: 0});
  createAndSendToken(user, 200, res)
});

exports.protected = catchAsync(async (req, res, next) => {
  //first check token
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  //check token is not empty
  if (!token) {
    return next(new AppError('please first login'))
  }
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  const currentUser = await User.findById(decode.id);
  //check user are exist or not
  if (!currentUser || currentUser.active == false) {
    return next(new AppError('Current user are delete'))
  }
  req.user = currentUser;
  next();
});

exports.checkPermission = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(new AppError('you do not have permission perform this action'))
    }
    next()
  }
}