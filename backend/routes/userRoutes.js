const express = require("express");
const controller = require("../controllers/userController");
const { isGuest, isLoggedIn, sessionStatus } = require("../middleware/auth");
const { logInLimiter } = require("../middleware/rateLimiters");
const {
  validateSignUp,
  validateLogin,
  validateResult,
} = require("../middleware/validator");

const router = express.Router();

//POST /users: create a new user account
router.post("/", isGuest, validateSignUp, validateResult, controller.create);

//POST /users/login: authenticate user's login
router.post(
  "/login",
  logInLimiter,
  isGuest,
  validateLogin,
  validateResult,
  controller.login
);

//GET /users/logout: logout a user
router.get("/logout", isLoggedIn, controller.logout);

//GET /users/test: test if a user is logged in
router.get("/test", sessionStatus);

module.exports = router;
