const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl,isLoggedIn,isProfileOwner,validateUser,varifyEmail,varifyUserEmail } = require("../middlewear");

const userController = require("../controllers/users")

const multer  = require('multer')  
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage });


router.route("/signup")
    .get(userController.renderSignupForm)               
    .post(varifyEmail,validateUser,wrapAsync(userController.signUser))



router.route("/login")
    .get(userController.renderLoginForm)           
    .post(saveRedirectUrl, passport.authenticate("local",{failureRedirect: "/login",failureFlash: true}), wrapAsync(userController.loginUser))
    //passpost.authenticate -> middleware h || local Strategy failureRedirect -> login hone me problem aati h to "/login" me redirect hoge || or flash ho jayega


router.get("/logout",userController.logoutUser)     

router.get("/", (req, res) => {                     
    res.redirect("/listings")
})
router.get("/update-form/:id",isLoggedIn,isProfileOwner, wrapAsync(userController.updateFormRender))  /
router.post("/update-password/:id", isLoggedIn, isProfileOwner, wrapAsync(userController.updatePassword))  

router.post("/update-account/:id", isLoggedIn, isProfileOwner, varifyUserEmail, validateUser, wrapAsync(userController.updateAccount))  

router.post("/update-image/:id", isLoggedIn, isProfileOwner, upload.single('image'), wrapAsync(userController.updateImage))  
router.route("/change-image/:id")
    .get(isLoggedIn,isProfileOwner,userController.renderImageChangeForm)
    .post(isLoggedIn,isProfileOwner,upload.single('image'), wrapAsync(userController.updateImage))  

router.delete("/delete/:id",isLoggedIn,isProfileOwner, wrapAsync(userController.deleteAccount))  

module.exports = router;                           