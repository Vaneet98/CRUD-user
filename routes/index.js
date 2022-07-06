const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const controller = require("../controller");
const checkUserAuth = require("../middlewares/authMiddleware.js");

router.use("/changepassword", checkUserAuth);

//----- Registration API for user ---------
router.post("/Registration", async (req, res) => {
  let user = await controller.userController.Registration(req.body);
  res.json(user);
});

//------- login API for user -----------------
router.post("/login", async (req, res) => {
  let user = await controller.userController.loginUsers(req,res,req.body);
  res.json(user);
});

//------ Logged out-------
router.get("/loggedout", async (req, res) => {
  let user = await controller.userController.loggedOut(req,res);
  res.json(user);
});
//------Change password for user by protected API -------
//protected router
router.post("/changepassword", async (req, res) => {
  let user = await controller.userController.changeUserPassword(
    req,
    res,
    req.body
  );
  res.json(user);
});

//-------View logged user details----
router.get("/loggedUserDetail", checkUserAuth, async (req, res) => {
  let user = await controller.userController.loggedUserDetail(req, res);
  res.json(user);
});

//----------Reset/change the password after send the code on Email-----
router.post("/send-reset-password-email", async (req, res) => {
  let user = await controller.userController.sendUserPasswordResetEmail(
    req,
    res,
    req.body
  );
  res.json(user);
});

//----- Reset the password when user only know Email address ---
router.post("/reset-password/:id/:token", async (req, res) => {
  let user = await controller.userController.userPasswordReset(req, res,req.body);
  res.json(user);
});
module.exports = router;
