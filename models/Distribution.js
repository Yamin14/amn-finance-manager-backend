// models/Distribution.js

const mongoose = require('mongoose');

const distributionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  amountPaid: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

}, { timestamps: true });

module.exports = mongoose.model('Distribution', distributionSchema);
