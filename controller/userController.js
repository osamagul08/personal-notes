const AppError = require('../utils/appError');
const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const responseHelper = require('../utils/responseHelper');


exports.updateMe = catchAsync(async (req, res, next) => {
    const updateData = {};
    updateData['fullname'] = req.body.fullname || req.user.fullname;
    updateData['phonnumber'] = req.body.phonnumber || req.user.phonnumber;
    const updateUser = await User.findByIdAndUpdate(req.user.id, updateData,  {
      new: true,
      runValidators: true
    })
    responseHelper(res, 'successful', 200, 'user have been updated', updateUser);
})
  
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false})
    responseHelper(res, 'successful', 200)
});

exports.getAllUser = catchAsync(async (req, res, next) => {
    const page = req.query.page*1 || 1;
    const limit = req.query.limit *1 || 100;
    const skip = (page - 1)*limit;
    const totalDoc = await User.countDocuments();
    const allUsers = await User.find().skip(skip).limit(limit);
    if (!allUsers) {
        return next(new AppError('zero records'))
    }
    responseHelper(res, 'successful', 200, '', allUsers, totalDoc);
})

exports.deleteUser = catchAsync(async (req, res, next) => {
    
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
        return next(new AppError('User did not found', 401))
    }
    responseHelper(res, 'successful', 200)
})

exports.updateUser = catchAsync(async (req, res, next) => {
    const userData = {};
    if (req.body.fullname) {
        userData['fullname'] = req.body.fullname
    }
    if (req.body.phonnumber) {
        userData['phonnumber'] = req.body.phonnumber
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, userData,  {
        new: true,
        runValidators: true
      });
    if (!updatedUser) {
        return next(new AppError('User did not Found', 401))
    }
    responseHelper(res, 'successful', 200, 'user have been updated', updatedUser)
})

exports.getUserById = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new AppError('User did not found'))
    }
    responseHelper(res, 'successful', 200, '', user);
})

exports.blockUser = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate('6178ed39714c68d731739553', {active: false});
    responseHelper(res, 'successful', 200, 'user id:'+req.params.id+' have been block');
})