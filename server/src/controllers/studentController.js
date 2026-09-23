const Student = require("../models/Student");

const { encryptBackend, decryptBackend, decryptFrontend, } = require("../utils/crypto");

const SENSITIVE_FIELDS = ["fullName", "phoneNumber", "dateOfBirth", "address", "courseEnrolled",];


// REGISTER STUDENT
exports.createStudent = async (req, res) => {
    try {
        const studentData = { ...req.body };
        if (studentData.email) {
            studentData.email = studentData.email.trim().toLowerCase();
        }
        SENSITIVE_FIELDS.forEach((field) => {
            if (studentData[field]) {
                studentData[field] = encryptBackend(studentData[field]);
            }
        });
        if (studentData.password) {
            studentData.password = encryptBackend(studentData.password);
        }
        const student = new Student(studentData);
        await student.save();
        return res.status(201).json({
            message: "Student registered successfully",
            id: student._id,
        });
    } catch (error) {
        console.error("Create Student Error:", error);
        return res.status(400).json({
            error: error.message,
        });
    }
};

// GET ALL STUDENTS
exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        const studentsForFrontend = students.map((doc) => {
            const student = doc.toObject();
            SENSITIVE_FIELDS.forEach((field) => {
                if (student[field]) {
                    try {
                        student[field] = decryptBackend(student[field]);
                    } catch (error) {
                        console.error(
                            `Failed to decrypt ${field}:`,
                            error.message
                        );
                    }
                }
            });
            delete student.password;
            return student;
        });
        return res.status(200).json(studentsForFrontend);
    } catch (error) {
        console.error("Get Students Error:", error);
        return res.status(500).json({
            error: "Failed to fetch students",
        });
    }
};

// UPDATE STUDENT
exports.updateStudent = async (req, res) => {
    try {
        const studentData = { ...req.body };
        if (studentData.email) {
            studentData.email = studentData.email.trim().toLowerCase();
        }
        SENSITIVE_FIELDS.forEach((field) => {
            if (studentData[field]) {
                studentData[field] = encryptBackend(studentData[field]);
            }
        });
        if (studentData.password) {
            studentData.password = encryptBackend(studentData.password);
        } else {
            delete studentData.password;
        }
        const updated = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: studentData },
            {
                new: true,
                runValidators: true,
            }
        );
        if (!updated) {
            return res.status(404).json({
                error: "Student not found",
            });
        }
        return res.status(200).json({
            message: "Student updated successfully",
        });
    } catch (error) {
        console.error("Update Student Error:", error);
        return res.status(400).json({
            error: error.message,
        });
    }
};


// DELETE STUDENT
exports.deleteStudent = async (req, res) => {
    try {
        const deleted = await Student.findByIdAndDelete(
            req.params.id
        );
        if (!deleted) {
            return res.status(404).json({
                error: "Student not found",
            });
        }
        return res.status(200).json({
            message: "Student deleted successfully",
        });
    } catch (error) {
        console.error("Delete Student Error:", error);
        return res.status(500).json({
            error: error.message,
        });
    }
};

// LOGIN
exports.loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required",
            });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const student = await Student.findOne({
            email: normalizedEmail,
        });
        if (!student) {
            return res.status(401).json({
                error: "Invalid Email or Password",
            });
        }
        const storedLayer1Password = decryptBackend(
            student.password
        );
        const storedPlainPassword = decryptFrontend(
            storedLayer1Password
        );
        const incomingPlainPassword = decryptFrontend(
            password
        );
        if (
            !storedPlainPassword ||
            !incomingPlainPassword ||
            storedPlainPassword !== incomingPlainPassword
        ) {
            return res.status(401).json({
                error: "Invalid Email or Password",
            });
        }
        return res.status(200).json({
            message: "Login successful",
            studentId: student._id,
        });
    } catch (error) {
        console.error("Login Student Error:", error);
        return res.status(500).json({
            error: "Login failed",
        });
    }
};