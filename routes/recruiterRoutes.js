const express = require("express");
const router = express.Router();
const {
    createAccount,
    dashboard,
    getSocials,
    editSocials,
    profileImage,
    getDetails,
    editDetails,
    changePassword,
    getModels,
    getOneRecruiter
} = require("../controllers/recruiterController");
const { verifyToken, recruiter_role } = require("../utils/verify");

router.post("/account", [verifyToken, recruiter_role], createAccount);
router.get("/dashboard", [verifyToken, recruiter_role], dashboard);
router.get("/social-media", [verifyToken, recruiter_role], getSocials);
router.post("/social-media", [verifyToken, recruiter_role], editSocials);
router.post("/profile-image", [verifyToken, recruiter_role], profileImage);
router.get("/details", [verifyToken, recruiter_role], getDetails);
router.post("/details", [verifyToken, recruiter_role], editDetails);
router.post("/change-password", [verifyToken, recruiter_role], changePassword);
router.get("/models", [verifyToken, recruiter_role], getModels);
router.get("/profile/:id", [verifyToken, recruiter_role], getOneRecruiter);

// router.get('/allrecruiters', allRecruiters)

module.exports = router;
