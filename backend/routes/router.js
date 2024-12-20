const express = require('express');
const router = express.Router();
const Feedback=require('../models/feedBack')
require('../config/db');
const authRoutes=require('../')
router.get('/', (req, res) => {
    res.send(`Hello from Technothlon Server`);
});

const School = require('../models/InfoSchool');
const Team = require('../models/teamInfo');
const InfoSchool = require('../models/InfoSchool');

router.post('/registerschool', async (req, res) => {
    const { cityCode, schoolCode, schoolName, cityName } = req.body;
    if (!cityCode || !schoolCode || !schoolName || !cityName) {
        res.status(422).send("Please fill all fields correctly");
        return;
    }
    try {
        const userExists = await School.findOne({ schoolCode: schoolCode });

        if (userExists) {
            return res.status(422).json({ status: 422, error: "School already exists" })
        }

        const schoolInfo = new School({ cityCode, schoolCode, schoolName, cityName });
        const data = await schoolInfo.save();
        if (data) {
            res.status(201).json({ success: "Registered" });
        }
        else {
            res.status(500).json({ error: "Failed to register" });
        }
    } catch (err) {
        console.log(err);
    }
});

router.put('/addTeamToSchool', async (req, res) => {
    const { schoolCode, team } = req.body;

    try {
        // Check for duplicates across all schools and teams
        const schools = await InfoSchool.find({});
        const duplicateFound = schools.some(existingSchool => {
            return existingSchool.teams.some(existingTeam => {
                return (
                    existingTeam.email1 === team.email1 ||
                    existingTeam.email2 === team.email2 ||
                    existingTeam.contact1 === team.contact1 ||
                    existingTeam.contact2 === team.contact2
                );
            });
        });

        if (duplicateFound) {
            return res.status(400).json({ status: 400, error: "Duplicate team member found" });
        }

        // If no duplicates found, proceed with adding the team to the school
        const existingSchool = await InfoSchool.findOne({ schoolCode: schoolCode });
        if (!existingSchool) {
            return res.status(404).json({ status: 404, error: "School not found" });
        }

        existingSchool.teams.push(team);
        const updatedSchool = await existingSchool.save();

        // Populate 'teams' field when querying for the document
        const populatedDoc = await InfoSchool.findById(updatedSchool._id).populate('teams');

        res.status(201).json(populatedDoc);
    } catch (error) {
        res.status(500).json({ error: "Failed to add team to school", details: error.message });
    }
});

router.get('/getSchools', async (req, res) => {
    const schools = await School.find();
    res.status(200).json(schools);
});

router.post('/addTeam', async (req, res) => {
    const { team } = req.body;
    const newTeam = new Team(team);
    const data = await newTeam.save();
    if (data) {
        res.status(201).json({ success: "Team Registered" });
    }
    else {
        res.status(500).json({ error: "Failed to register" });
    }
});




module.exports = router;