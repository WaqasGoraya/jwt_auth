const express = require('express');
const userController = require('../../app/http/controllers/userController');
const router = express.Router();
const isAuthenticae = require('../../middlewares/auth-middleware');


router.use('/changepassword',isAuthenticae);
router.use('/loggeduser', isAuthenticae);
//Public Routes
router.post('/register',userController.userRegister);
router.post('/login',userController.userLogin);
router.post('/send-reset-password-email',userController.sendresetpassemail);
router.post('/reset-password/:id/:token',userController.resetPassword);

//protected routes
router.post('/changepassword',userController.changePassword);
router.get('/loggeduser',userController.loggedUser);
module.exports = router;