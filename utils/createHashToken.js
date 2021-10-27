const crypto = require('crypto')

const createHashToken = () => {
    const tokenObject = {};
    tokenObject['resetToken'] = crypto.randomBytes(32).toString('hex');
    tokenObject['passwordSignupToken'] = crypto.createHash('sha256').update(tokenObject['resetToken']).digest('hex');
    tokenObject['passwordResetExpire'] = Date.now() + 10 * 60 * 1000;
    return tokenObject;
}
module.exports = createHashToken;