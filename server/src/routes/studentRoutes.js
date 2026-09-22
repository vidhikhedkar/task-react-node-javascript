const express = require('express');
const router = express.Router();
const {
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent,
    loginStudent
} = require('../controllers/studentController');

// Registration endpoints (supports /register and /students)
router.post('/register', createStudent);
router.post('/students', createStudent);

// Student directory & authentication endpoints
router.get('/students', getStudents);
router.put('/student/:id', updateStudent);
router.delete('/student/:id', deleteStudent);
router.post('/login', loginStudent);

module.exports = router;