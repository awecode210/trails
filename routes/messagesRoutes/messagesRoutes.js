const express = require("express");
const router = new express.Router();
const controllers = require("../../Controllers/usersControllers");
// const authenticate = require("../middleware/authenticate");
// routes





router.post('/doc/signup', controllers.signup);
router.post('/doc/signin', controllers.signin);
router.post('/doc/busisignup', controllers.busisignup);
// router.get("/doc/validuser",authenticate,controllers.validuser);

//authenticate at page you send 


// chat sys

router.get("/get_contacts_busi",controllers.get_contacts_busi)
router.get("/get_contacts_admin",controllers.get_contacts_admin)
router.get('/message_data/:userID', controllers.get_message_data);
router.post('/put_messages', controllers.message_data);

// chat sys

//





module.exports = router