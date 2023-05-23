const express = require("express");
const router = express.Router();
const verify = require("../verification/verifyToken");
const { GetAllUsersByGender } = require("../controllers/userActionsController");

router.post("/getallusersbygender", verify, GetAllUsersByGender);

module.exports = router;
