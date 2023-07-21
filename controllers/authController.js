const User = require('../modals/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');

//Register User
module.exports.registerUser = catchAsync(async(req, res, next) => {
    //Check if both password are same or not
    if (req.body.password !== req.body.passwordAgain) {
        console.logo("Passwords don't match");
    }
    //Generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //Create new user
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        passwordAgain: hashedPassword,
    })
    //Save User
    const user = await newUser.save();
    res.status(200).json(user);
})

module.exports.loginUser = async (req, res) => {
    try {
        //Find user
        const user = await User.findOne({ username: req.body.username });
        //No user found condition 
        if (!user) { return res.status(401).json("Wrong credentials!") }
        //Compare Passoword
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) { return res.status(401).json("Wrong credentials!") }
        //Create access token
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_SECRET, { expiresIn: "1d" });

        //dont show password
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}