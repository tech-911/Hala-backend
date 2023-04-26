const express = require("express");
const router = express.Router();
const verify = require("../verification/verifyToken");
const passport = require("passport");
const {
  index,
  login,
  facebooksignup,
  googlesignup,
  logout,
  phonesignup,
  otp,
  register
} = require("../controllers/authController");

router.get("/", index); //index

//---------------Social Authentication---------------------
router.post(
  "/facebooksignup",
  passport.authenticate("facebook-token", { scope: "email", session: false }),
  facebooksignup
);
router.post("/googlesignup", googlesignup); //google authentication

//---------------Social Authentication End-----------------
router.post("/login", login);
router.post("/logout", logout);
router.post("/phone", phonesignup);
router.post("/otp", otp);
router.post("/register", register);

module.exports = router;
