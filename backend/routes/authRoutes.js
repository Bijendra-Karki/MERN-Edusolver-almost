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
  re
} from '../controllers/authController.js';
import { userValidation, validation, passwordValidation } from '../validation/validator.js';

// ===== Router =====
const router = express.Router();

// ===== Routes =====
router.get("/user/list", requireSignin, (req, res) => {
  res.json({ message: "Only authenticated users see this" });
});
router.post('/register', userValidation, validation, postUser);
router.put('/confirmation/:token', postEmailConfirmation);
router.post('/signin', signIn);
router.post('/signout', signout);
router.post('/forget/password', forgetPassword);
router.put('/reset/password/:token', passwordValidation, validation, resetPassword);
router.get('/user/list', requireAdmin, userList);
router.get('/user/details/:id', userDetails);

// ===== Export =====
export default router;
