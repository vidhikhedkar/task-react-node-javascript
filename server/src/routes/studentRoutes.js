const express = require('express');
const router = express.Router();
const { createStudent, getStudents, updateStudent, deleteStudent, loginStudent } = require('../controllers/studentController');

router.post('/register', createStudent);
router.post('/students', createStudent);
router.get('/students', getStudents);
router.put('/student/:id', updateStudent);
router.delete('/student/:id', deleteStudent);
router.post('/login', loginStudent);

module.exports = router;