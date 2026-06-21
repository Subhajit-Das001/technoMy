const express = require('express');
const router = express.Router();
const Online26 = require('../models/online26');
const Offline26 = require('../models/offline26');
const cosStudent = require('../models/cos_student');
const NewStudent = require('../models/newStudent');
const jwt = require('jsonwebtoken');
const { authLimiter } = require('../middleware/auth');

// Check registered student (only for Offline26)
router.post('/check-student', authLimiter, async (req, res) => {
  try {
    const { rollNumber, phone } = req.body;
    console.log('Raw input:', { rollNumber, phone });

    // Clean up the inputs
    const cleanPhone = phone.trim().replace(/\D/g, '');
    const cleanRollNumber = rollNumber ? rollNumber.trim().toUpperCase() : '';

    console.log('Cleaned input:', { cleanPhone, cleanRollNumber });

    // 1. Check Offline26
const offlineStudent = await Offline26.findOne({
  rollNumber: cleanRollNumber,
});

if (offlineStudent) {
  const isContact1 = offlineStudent.contact1 === cleanPhone;
  const isContact2 = offlineStudent.contact2 === cleanPhone;

  if (!isContact1 && !isContact2) {
    return res.json({
      exists: false,
      message: "Invalid phone number.",
    });
  }

  return res.json({
    exists: true,
    name: isContact1 ? offlineStudent.name1 : offlineStudent.name2,
    email: isContact1 ? offlineStudent.email1 : offlineStudent.email2,
    phone: cleanPhone,
    school: isContact1 ? offlineStudent.school1 : offlineStudent.school2,
    studentType: "offline",
  });
}

// 2. Check Online26 only if not found in Offline26
const onlineStudent = await Online26.findOne({
  rollNumber: cleanRollNumber,
});

if (onlineStudent) {
  const isContact1 = onlineStudent.contact1 === cleanPhone;
  const isContact2 = onlineStudent.contact2 === cleanPhone;

  if (!isContact1 && !isContact2) {
    return res.json({
      exists: false,
      message: "Invalid phone number.",
    });
  }

  return res.json({
    exists: true,
    name: isContact1 ? onlineStudent.name1 : onlineStudent.name2,
    email: isContact1 ? onlineStudent.email1 : onlineStudent.email2,
    phone: cleanPhone,
    school: isContact1 ? onlineStudent.school1 : onlineStudent.school2,
    studentType: "online",
  });
}

// 3. Check CosStudent only if not found above
const student = await cosStudent.findOne({
  rollNumber: cleanRollNumber,
});

if (student) {
  return res.json({
    exists: true,
    name: student.name,
    email: student.email,
    phone: cleanPhone,
    school: student.school,
    studentType: "cos",
  });
}

// 4. Not found anywhere
return res.json({
  exists: false,
  message: "Student not found.",
});
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({
      exists: false,
      message: 'Server error while checking student details'
    });
  }
});

// Sign in new student
router.post('/signin-new', authLimiter, async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (!email || !phone) {
      return res.json({ success: false, message: 'Email and phone are required.' });
    }

    // Clean up phone number
    const cleanPhone = phone.trim().replace(/\D/g, '');

    const student = await NewStudent.findOne({
      email: email.toLowerCase(),
      phone: cleanPhone
    });

    if (!student) {
      return res.json({ success: false, message: 'No student found. Please register first.' });
    }

    // Include all necessary data in response
    res.json({
      success: true,
      name: student.name,
      email: student.email,
      phone: student.phone,
      school: student.school,
      city: student.city,
      studentType: "new",
    });
  } catch (error) {
    console.error('Error signing in student:', error);
    res.status(500).json({ asuccess: false, message: 'Sign in failed' });
  }
});

// Register new student
router.post('/register-new', authLimiter, async (req, res) => {
  try {
    const { name, email, phone, school, city } = req.body;

    if (!name || !email || !phone || !school || !city) {
      return res.json({ success: false, message: 'All fields are required.' });
    }

    // Clean up the inputs
    const cleanPhone = phone.trim().replace(/\D/g, '');
    const cleanEmail = email.toLowerCase();

    // Check if already exists
    const existing = await NewStudent.findOne({
      email: cleanEmail,
      phone: cleanPhone
    });

    if (existing) {
      return res.json({
        success: false,
        message: 'Student already registered. Please sign in.',
        shouldSignIn: true
      });
    }

    // Create new student with proper case formatting
    const newStudent = new NewStudent({
      name: toProperCase(name),
      email: cleanEmail,
      phone: cleanPhone,
      school: toProperCase(school),
      city: toProperCase(city)
    });

    await newStudent.save();
    res.json({
      success: true,
      message: 'Registration successful! Please sign in.',
      shouldSignIn: true
    });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// Utility function for proper case formatting
const toProperCase = (str) => {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

module.exports = router;