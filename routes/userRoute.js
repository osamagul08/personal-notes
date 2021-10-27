const express = require('express');
const authController = require('../controller/authController');
const userController = require('../controller/userController')

const route = express.Router();

route.route('/signup').get(authController.signup);
route.route('/verification/:token').get(authController.verification);
route.route('/resendlink').post(authController.resend);
route.route('/login').post( authController.login)

route.use(authController.protected)
route.route('/updateme').patch(userController.updateMe);
route.route('/deleteme').delete(userController.deleteMe);

route.use(authController.checkPermission('admin'));
route.route('/').get(userController.getAllUser);

route.route('/:id').get(userController.getUserById)
.patch(userController.updateUser)
.delete(userController.deleteUser)

module.exports = route;