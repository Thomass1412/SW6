import react from 'react';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, email, password, role} = req.body;
    const userExists = await User.findOne({ email }); 
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    } 

    const user = await User.create({
        _id: new mongoose.Types.ObjectId(),
        username,
        email,
        password, 
        role
    });

    res.status(201).json(user);
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: null
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    } 
});