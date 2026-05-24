const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const TechnopedQuestion = require('../models/technoped-question');
const { temporaryTechnopediaContest } = require('../technoped-question/int-question');

const seedTemporaryQuestions = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is missing. Add it to backend/.env before seeding questions.');
    }

    await mongoose.connect(process.env.MONGO_URI);

    const payload = {
        ...temporaryTechnopediaContest,
        createdAt: new Date()
    };

    const contest = await TechnopedQuestion.findOneAndUpdate(
        {
            contest: payload.contest,
            year: payload.year
        },
        { $set: payload },
        {
            new: true,
            upsert: true,
            runValidators: true
        }
    );

    console.log(`Seeded ${contest.questions.length} temporary questions for ${contest.year}.`);
    console.log(`Contest document id: ${contest._id}`);
};

seedTemporaryQuestions()
    .catch((error) => {
        console.error('Failed to seed temporary questions:', error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
