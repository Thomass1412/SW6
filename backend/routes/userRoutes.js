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