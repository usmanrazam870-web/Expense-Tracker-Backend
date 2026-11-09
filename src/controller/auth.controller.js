const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function signUpUser(req, res) {
    try {
        const { username, email, password } = req.body
        if (username === '' || email === '' || password === '') {
            return res.status(409).json({
                message: "Please Fill All the Field"
            })
        }
        const isUserExist = await userModel.findOne({
            $or: [
                { username }, { email }
            ]
        })
        if (isUserExist) {
            return res.status(409).json({
                message: "User Exist"
            })
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const user = await userModel.create({
            username, email, password: passwordHash
        })
        const token = jwt.sign({
            _id: user._id,
            username: user.username
        }, process.env.JWT_PRIVATE_KEY)
        res.cookie("token", token)

        const userResponse = user.toObject()
        delete userResponse.password

        res.status(201).json({
            message: "User Signup Successfully",
            user: userResponse,
            token
        })
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}

async function logInUser(req, res) {
    try {
        const { username, email, password } = req.body
        const user = await userModel.findOne({
            $or: [
                { username }, { email }
            ]
        })
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }
        const token = jwt.sign({
            _id: user._id,
            username: user.username
        }, process.env.JWT_PRIVATE_KEY)
        res.cookie("token", token)

        const userResponse = user.toObject()
        delete userResponse.password

        res.status(200).json({
            message: "User LoggedIn Successfully",
            user: userResponse,
            token
        })
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}

module.exports = { signUpUser, logInUser }