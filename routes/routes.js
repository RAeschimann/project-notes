var express = require('express');
var router = express.Router();
var notes = require('../controller/controller.js');

router.get("/notes", notes.getNotesFromServer);
router.post("/notes", notes.storeNotesOnServer);

module.exports = router;