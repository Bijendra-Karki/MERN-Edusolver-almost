// ===== Imports =====
import express from 'express';
import { 
  postUser, 
  postEmailConfirmation, 
  signIn, 
  forgetPassword, 
  resetPassword, 
  userList, 
  userDetails, 
  requireAdmin, 
  signout ,
  requireSignin,
  updateUser
} from '../controllers/authController.js';
import { userValidation, validation, passwordValidation } from '../validation/validator.js';

// ===== Router =====
const router = express.Router();


// ===== Routes =====
router.post('/register', userValidation, validation, postUser);
router.put('/confirmation/:token', postEmailConfirmation);
router.post('/signin', signIn);
router.post('/signout', signout);
router.post('/forget/password', forgetPassword);
router.put('/reset/password/:token', passwordValidation, validation, resetPassword);
router.get('/user/list', requireSignin,requireAdmin, userList);
router.get('/user/details/:id', userDetails);
// Route for updating a user
router.put('/userUpdate/:id', requireSignin, requireAdmin, updateUser); 

// ===== Export =====
export default router;
