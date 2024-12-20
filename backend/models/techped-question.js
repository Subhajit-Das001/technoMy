                                                                                                                                                                                                                                 const mongoose = require('mongoose');
const {Schema} = mongoose;

const questionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: String,
    required: true
  }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;