const rateLimit = require('express-rate-limit');
const joi = require('joi');

/**
 * Middleware to check for the ADMIN_SECRET_KEY in the request headers.
 */
const isAdmin = (req, res, next) => {
    const adminToken = req.headers['x-admin-token'];
    const secretKey = process.env.ADMIN_SECRET_KEY;

    if (!adminToken || adminToken !== secretKey) {
        return res.status(401).json({ 
            success: false, 
            message: 'Unauthorized: Invalid or missing Admin Token. Please provide the correct X-Admin-Token header.' 
        });
    }
    next();
};

/**
 * Common Rate Limiters
 */
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, 
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

const feedbackLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, 
    message: { message: 'Feedback limit reached. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, 
    message: { message: 'Too many auth attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Input Validation Schemas
 */
const announcementSchema = joi.object({
    id: joi.number().required(),
    title: joi.string().max(200).required(),
    content: joi.string().max(5000).required(),
    link: joi.string().uri().allow('').optional()
});

const feedbackSchema = joi.object({
    name: joi.string().max(100).required(),
    email: joi.string().email().required(),
    feedbackType: joi.string().valid('bug', 'suggestion', 'other', 'technical', 'contest').required(),
    feedbackContent: joi.string().max(2000).required()
});
const cos_loginSchema = joi.object({
    school_id: joi.string().required(),
    branch_id: joi.string().required(),
    bpoc_mail: joi.string().email().required()
});
const poc_registerSchema = joi.object({
    branch_name: joi.string().required(),
    school_id: joi.string().required(),
    bpoc_name: joi.string().required(),
    bpoc_mail: joi.string().email().required(),
    bpoc_contact: joi.string().min(10).max(15).required(),
    city: joi.string().required(),
    state: joi.string().required(),
    // zone: joi.string().required()
});

module.exports = {
    isAdmin,
    globalLimiter,
    feedbackLimiter,
    authLimiter,
    schemas: {
        announcement: announcementSchema,
        feedback: feedbackSchema,
        cos_login : cos_loginSchema,
        poc_register: poc_registerSchema
    }
};
