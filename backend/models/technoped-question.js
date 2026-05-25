const mongoose = require('mongoose');

const technopediaQuestionSchema = mongoose.Schema({
    questionId: { type: Number, required: true },
    letter: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    answer: { type: Number, required: true },
    points: { type: Number, required: true }
});

const technopediaSchema = mongoose.Schema({
    contest: { type: String, required: true },
    questions: [technopediaQuestionSchema],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    year:{type:String,required:true},
    createdAt: { type: Date, default: Date.now }
});

const TechnopedQuestion = mongoose.model('TechnopedQuestion', technopediaSchema);
module.exports = TechnopedQuestion;  