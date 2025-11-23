// routes/index.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');


router.get('/', studentController.list);

router.get('/students/new',studentController.newForm)
router.post("/students", studentController.create)

router.get('/students/:id/edit', studentController.editForm);
router.put('/students/:id', studentController.update);

router.get('/students/:id', studentController.show);

module.exports = router;
