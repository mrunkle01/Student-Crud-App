// routes/index.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');


router.get('/', studentController.list);

router.get('/students/new',studentController.newForm)

router.get('/students/:id', studentController.show);

module.exports = router;
