import { Router } from "express";
import { signIn, signUp, resetPasswordRequest } from "../controllers/authController";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/reset-password", resetPasswordRequest);

export default router;

