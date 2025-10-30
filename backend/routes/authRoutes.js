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
  signout,
  requireSignin,
  updateUser,
  requireInstructor,
  requireStudent,
  requireUser,
  getMe
} from '../controllers/authController.js';
import { userValidation, validation, passwordValidation } from '../validation/validator.js';

// ===== Router =====
const router = express.Router();


// ===== Routes =====
router.post('/register', userValidation, validation, postUser);
router.put('/confirmation/:token', postEmailConfirmation);
router.post('/signin', signIn);
// In your router file:
router.post('/signout', requireSignin, signout);
// router.post('/signout', signout);
router.post('/forget/password', forgetPassword);
router.put('/reset/password/:token', passwordValidation, validation, resetPassword);
router.get('/user/list', requireSignin, requireUser, userList);
router.get('/user/details/:id', requireSignin, userDetails);
router.get('/user/me', requireSignin, getMe);
// Route for updating a user
router.put('/userUpdate/:id', requireSignin, requireUser, updateUser);

// ===== Export =====
export default router;
