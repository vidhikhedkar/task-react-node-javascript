const Student = require('../models/Student');

const {
    encryptFrontend,
    decryptFrontend,
    encryptBackend,
    decryptBackend
} = require('../utils/crypto');


// Fields that use 2-level encryption
const SENSITIVE_FIELDS = [
    'fullName',
    'phoneNumber',
    'dateOfBirth',
    'address',
    'courseEnrolled'
];


// ======================================================
// REGISTER STUDENT
// ======================================================

exports.createStudent = async (req, res) => {
    try {
        const studentData = { ...req.body };

        // Normalize email
        if (studentData.email) {
            studentData.email = studentData.email.trim().toLowerCase();
        }


        // ----------------------------------------------
        // Encrypt normal sensitive fields
        //
        // Plain data
        //    ↓
        // Frontend Encryption
        //    ↓
        // Backend Encryption
        //    ↓
        // MongoDB
        // ----------------------------------------------

        SENSITIVE_FIELDS.forEach((field) => {
            if (studentData[field]) {

                // Layer 1
                const layer1 = encryptFrontend(studentData[field]);

                // Layer 2
                const layer2 = encryptBackend(layer1);

                studentData[field] = layer2;
            }
        });


        // ----------------------------------------------
        // Password
        //
        // Password
        //    ↓
        // Frontend Encryption
        //    ↓
        // Backend Encryption
        //    ↓
        // MongoDB
        // ----------------------------------------------

        if (studentData.password) {

            // Layer 1
            const layer1Password = encryptFrontend(
                studentData.password
            );

            // Layer 2
            const layer2Password = encryptBackend(
                layer1Password
            );

            studentData.password = layer2Password;
        }


        // Save student
        const student = new Student(studentData);

        await student.save();


        res.status(201).json({
            message: 'Student registered successfully',
            id: student._id
        });

    } catch (error) {

        console.error('Create Student Error:', error);

        res.status(400).json({
            error: error.message
        });
    }
};



// ======================================================
// GET ALL STUDENTS
// ======================================================

// ======================================================
// GET ALL STUDENTS
// ======================================================

exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find();

        const studentsForFrontend = students.map((doc) => {
            const student = doc.toObject();

            // Backend removes only Layer 2.
            // Frontend will remove Layer 1.
            const sensitiveFields = [
                'fullName',
                'phoneNumber',
                'dateOfBirth',
                'address',
                'courseEnrolled'
            ];

            sensitiveFields.forEach((field) => {
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

            // Never send password to frontend
            delete student.password;

            return student;
        });

        res.status(200).json(studentsForFrontend);

    } catch (error) {
        console.error('Get Students Error:', error);

        res.status(500).json({
            error: 'Failed to fetch students'
        });
    }
};



// ======================================================
// UPDATE STUDENT
// ======================================================

exports.updateStudent = async (req, res) => {
    try {

        const studentData = { ...req.body };


        // Normalize email
        if (studentData.email) {
            studentData.email = studentData.email.trim().toLowerCase();
        }


        // Encrypt normal sensitive fields
        SENSITIVE_FIELDS.forEach((field) => {

            if (studentData[field]) {

                // Layer 1
                const layer1 = encryptFrontend(
                    studentData[field]
                );

                // Layer 2
                const layer2 = encryptBackend(layer1);

                studentData[field] = layer2;
            }
        });


        // Encrypt password separately
        if (studentData.password) {

            const layer1Password = encryptFrontend(
                studentData.password
            );

            const layer2Password = encryptBackend(
                layer1Password
            );

            studentData.password = layer2Password;
        }


        const updated = await Student.findByIdAndUpdate(
            req.params.id,
            studentData,
            {
                new: true
            }
        );


        if (!updated) {
            return res.status(404).json({
                error: 'Student not found'
            });
        }


        res.status(200).json({
            message: 'Student updated successfully'
        });

    } catch (error) {

        console.error('Update Student Error:', error);

        res.status(400).json({
            error: error.message
        });
    }
};



// ======================================================
// DELETE STUDENT
// ======================================================

exports.deleteStudent = async (req, res) => {
    try {

        const deleted = await Student.findByIdAndDelete(
            req.params.id
        );


        if (!deleted) {
            return res.status(404).json({
                error: 'Student not found'
            });
        }


        res.status(200).json({
            message: 'Student deleted successfully'
        });

    } catch (error) {

        console.error('Delete Student Error:', error);

        res.status(500).json({
            error: error.message
        });
    }
};



// ======================================================
// LOGIN
// ======================================================

exports.loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("\n========== LOGIN DEBUG ==========");

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        console.log("Email:", normalizedEmail);
        console.log("Incoming encrypted password:", !!password);

        const student = await Student.findOne({
            email: normalizedEmail
        });

        if (!student) {
            console.log("❌ Student not found");

            return res.status(401).json({
                error: "Invalid Email or Password"
            });
        }

        console.log("✅ Student found:", student._id);

        // ------------------------------------------------
        // DATABASE PASSWORD
        // Layer 2 -> Layer 1
        // ------------------------------------------------

        const storedLayer1Password = decryptBackend(
            student.password
        );

        console.log(
            "Stored Layer 1 decrypted:",
            !!storedLayer1Password
        );

        // ------------------------------------------------
        // DATABASE PASSWORD
        // Layer 1 -> Plain text
        // ------------------------------------------------

        const storedPlainPassword = decryptFrontend(
            storedLayer1Password
        );

        console.log(
            "Stored plain password decrypted:",
            !!storedPlainPassword
        );

        // ------------------------------------------------
        // INCOMING PASSWORD
        // Layer 1 -> Plain text
        // ------------------------------------------------

        const incomingPlainPassword = decryptFrontend(
            password
        );

        console.log(
            "Incoming plain password decrypted:",
            !!incomingPlainPassword
        );

        console.log(
            "Incoming password length:",
            incomingPlainPassword.length
        );

        console.log(
            "Stored password length:",
            storedPlainPassword.length
        );

        const passwordMatches =
            incomingPlainPassword === storedPlainPassword;

        console.log(
            "Password match:",
            passwordMatches
        );

        console.log("================================\n");

        if (!passwordMatches) {
            return res.status(401).json({
                error: "Invalid Email or Password"
            });
        }

        return res.status(200).json({
            message: "Login successful",
            studentId: student._id
        });

    } catch (error) {
        console.error("Login Student Error:", error);

        return res.status(500).json({
            error: "Login failed"
        });
    }
};