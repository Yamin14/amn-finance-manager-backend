// routes/books.js

const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books', error: err.message });
  }
});

// Add new book
router.post('/', async (req, res) => {
  const { title, cost, totalGiven } = req.body;
  try {
    const newBook = new Book({ title, cost, totalGiven, user: req.user.id });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add book', error: err.message });
  }
});

// Get single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (book.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch book', error: err.message });
  }
});

// Update book
router.put('/:id', async (req, res) => {
  const { title, cost, totalGiven } = req.body;

  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (book.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not allowed to update this book' });
    }

    const updated = await Book.findByIdAndUpdate(
      req.params.id,
      { title, cost, totalGiven, user: req.user.id },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Book not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update book', error: err.message });
  }
});

// Delete book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (book.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not allowed to update this book' });
    }
    
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete book', error: err.message });
  }
});

module.exports = router;
