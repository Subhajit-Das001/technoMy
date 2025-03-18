const express = require("express");
const router = express.Router();
const CityRep_portal = require("../models/cityrep_portal");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");

dotenv.config();

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


const allowedOrigins = [
    'http://localhost:3000', // Local development URL
    'https://technothlon.techniche.org.in' // Production URL
  ];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
router.use(cors(corsOptions));

// User Login Route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await CityRep_portal.findOne({ username });

        if (!user || user.password !== password) {  // Directly compare passwords
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { username: user.username, source: "CityRep_portal" },
            process.env.KEY,
            { expiresIn: "7h" }
        );

        // Secure cookie settings
        res.cookie("token", token, { maxAge: 3600000, httpOnly: true });

        return res.json({ status: true, message: "Login successful", token });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Token Verification Middleware
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.KEY, (err, decoded) => {
        if (err) {
            console.error("Error verifying token:", err);
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        req.user = decoded; // Store decoded user info
        next();
    });
};

// Get User Profile
router.get('/user', verifyToken, async (req, res) => {
    const { username } = req.user;  // Fix: use req.user.username instead of name
    
    try {
        const user = await CityRep_portal.findOne({ username }).select("-password"); // Exclude password from response
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.json({
            name: user.name,
            city: user.city,
            photoLink: user.link,
            zone:user.zone // e.g. "https://example.com/myavatar.jpg"
          });
    } catch (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Logout Route
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ status: true, message: "Logged out successfully" });
});



module.exports = router;
