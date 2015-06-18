var express = require('express');
var router = express.Router();
var notes = require('../controller/controller.js');

router.get("/getNotesFromServer", notes.getNotesFromServer);
router.post("/storeNotesOnServer", notes.storeNotesOnServer);

module.exports = router;