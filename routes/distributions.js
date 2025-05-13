// routes/distributions.js

const express = require('express');
const router = express.Router();
const Distribution = require('../models/Distribution');
const Student = require('../models/Student');
const Book = require('../models/Book');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);

// Get all distributions
router.get('/', async (req, res) => {
  try {
    const distributions = await Distribution.find({ user: req.user.id })
      .populate('student')
      .populate('book');
    res.json(distributions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new distribution
router.post('/', async (req, res) => {
  const distribution = new Distribution({ ...req.body, user: req.user.id });
  try {
    const savedDistribution = await distribution.save();
    res.status(201).json(savedDistribution);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a distribution (e.g. add/update payment)
router.put('/:id', async (req, res) => {
  try {
    const dist = await Distribution.findById(req.params.id);
    if (!dist) return res.status(404).json({ message: 'Distribution not found' });

    if (dist.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not allowed to update this distribution' });
    }

    const updated = await Distribution.findByIdAndUpdate(req.params.id, { ...req.body, user: req.user.id }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a distribution
router.delete('/:id', async (req, res) => {
  try {
    const dist = await Distribution.findById(req.params.id);
    if (!dist) return res.status(404).json({ message: 'Distribution not found' });

    if (dist.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not allowed to update this distribution' });
    }
    
    await Distribution.findByIdAndDelete(req.params.id);
    res.json({ message: 'Distribution deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
