const express = require("express");
const router = express.Router();
const {
    createAccount,
    dashboard,
    socials,
    profileImage,
    getDetails,
    editDetails,
    changePassword,
    getModels,
    getOneModel
} = require("../controllers/recruiterController");
const { verifyToken, recruiter_role } = require("../utils/verify");

router.post("/account", [verifyToken, recruiter_role], createAccount);
router.get("/dashboard", [verifyToken, recruiter_role], dashboard);
router.get("/details", [verifyToken, recruiter_role], getDetails);
router.post("/social-media", [verifyToken, recruiter_role], socials);
router.post("/profile-image", [verifyToken, recruiter_role], profileImage);
router.post("/edit-details", [verifyToken, recruiter_role], editDetails);
router.post("/change-password", [verifyToken, recruiter_role], changePassword);
router.get("/models", [verifyToken, recruiter_role], getModels);
router.get("/model/:id", [verifyToken, recruiter_role], getOneModel);

// router.get('/allrecruiters', allRecruiters)

module.exports = router;
