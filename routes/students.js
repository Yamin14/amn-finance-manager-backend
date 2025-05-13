// routes/students.js

const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find({ user: req.user.id });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch students', error: err.message });
  }
});

// Add new student
router.post('/', async (req, res) => {
  const { name, className } = req.body;
  try {
    const newStudent = new Student({ name, className, user: req.user.id });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add student', error: err.message });
  }
});

// Get single student
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    if (student.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not allowed to update this student' });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch student', error: err.message });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  const { name, className } = req.body;
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (student.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not allowed to update this student' });
    }

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { name, className, user: req.user.id },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Student not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update student', error: err.message });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (student.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not allowed to update this student' });
    }

    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete student', error: err.message });
  }
});

module.exports = router;
