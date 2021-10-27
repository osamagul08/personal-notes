const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Pleas enter full name'],
        minlength: 5
    },
    username: {
        type: String,
        required: [true, 'Please enter username '],
        unique: [true, 'Username must be unique'],
    },
    phonnumber: {
        type: Number,
        required: [true, 'Please enter contect number']
    },
    email: {
        type: String,
        required: [true, 'please enter email'],
        unique: true,
        lowercase : true,
        validate : [validator.isEmail, 'please enter correct email']
    },
    gender: {
        type: String,
        required: [true, 'please select gender']
    },
    role: {
        type: String,
        enum:['admin',  'user'],
        default: 'user'
    },
    password: {
        type: String,
        minlength: 8,
        required: true,
        select: false
    },
    confirmpassword: {
        type: String,
        required: true,
        validate: {validator:function(el) {
            return el  === this.password;
            }, message: 'Passowrd must be match'
        }
    },
    userattamp: {
        type: Number,
        default: 0
    },
    userblocktime : Date,
    active: {
        type: Boolean,
        default: false
    },
    passworChangAt: Date,
    passwordSignupToken: String,
    passwordResetExpire: Date

}) 

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next()
    this.password = await bcryptjs.hash(this.password, 10)
    this.confirmpassword = undefined
    next();
})
userSchema.methods.checkPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcryptjs.compare(candidatePassword, userPassword);
};
userSchema.methods.checkUserAttamp = async function (userattamp) {
    if (userattamp >= 3) {
        return false;
    } else {
        return true;
    }
}
const User = mongoose.model('User', userSchema);
module.exports = User;