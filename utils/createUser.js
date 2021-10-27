const createHashToken = require('./createHashToken');
const AppError = require('./appError');

const createObject = (req, next) => {
    const tokenObject = createHashToken();
    const newUser = {};
    newUser['fullname'] = checkStringEmpty(req.body.fullname, 'Fullname', next);
    newUser['username'] = checkStringEmpty(req.body.username, 'Username', next);
    newUser['email'] = checkStringEmpty(req.body.email, 'Username', next);
    newUser['phonnumber'] = checkStringEmpty(req.body.phonnumber, 'Phone Number', next);
    newUser['gender'] = checkStringEmpty(req.body.gender, 'Gender', next);
    newUser['passwordSignupToken'] = tokenObject['passwordSignupToken'];
    newUser['passwordResetExpire'] = tokenObject['passwordResetExpire'];
    newUser['password'] = checkStringEmpty(req.body.password, 'Password', next);
    newUser['confirmpassword'] = checkStringEmpty(req.body.confirmpassword, 'Confirm Password', next);
    newUser['resetToken'] = tokenObject['resetToken'];
    return newUser;
}
const checkStringEmpty = (str, key, next) => {
    if (str === undefined || str === '') {
      return next(new AppError(key+' its not empty', 400))
    }
    return str;
}

module.exports = createObject;