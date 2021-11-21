const express = require("express");
const router = express.Router();
const {
    createAccount,
    dashboard,
    getSocials,
    editSocials,
    getOneModel,
    profileImage,
    uploadImage,
    getDetails,
    editDetails,
    changePassword,
    getMedia,
    deleteMedia
} = require("../controllers/modelController");
const { verifyToken, model_role } = require("../utils/verify");

router.post("/account", [verifyToken, model_role], createAccount);
router.get("/dashboard", [verifyToken, model_role], dashboard);
router.get("/social-media", [verifyToken, model_role], getSocials);
router.post("/social-media", [verifyToken, model_role], editSocials);
router.post("/profile-image", [verifyToken, model_role], profileImage);
router.post("/upload-image", [verifyToken, model_role], uploadImage);
router.get("/details", [verifyToken, model_role], getDetails);
router.post("/details", [verifyToken, model_role], editDetails);
router.post("/change-password", [verifyToken, model_role], changePassword);
router.get("/media", [verifyToken, model_role], getMedia);
router.delete("/delete-media/:id", [verifyToken, model_role], deleteMedia)


router.get("/profile/:id", verifyToken, getOneModel);

module.exports = router;
