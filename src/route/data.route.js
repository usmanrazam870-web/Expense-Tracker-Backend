const express=require('express')
const dataController=require('../controller/data.controller')
const router=express.Router()

router.post('/addexpense',dataController.addExpense)
router.get('/total',dataController.totalExpense)
router.get('/update/:id',dataController.updateExpense)
router.get('/delete/:id',dataController.deleteExpense)

module.exports=router