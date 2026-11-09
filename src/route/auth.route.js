const express=require('express')
const authController=require('../controller/auth.controller')
const router=express.Router()

router.post('/signup',authController.signUpUser)
router.post('/login',authController.logInUser)


module.exports=router