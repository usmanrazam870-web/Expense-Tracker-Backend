const dataModel = require('../models/data.model')
const jwt = require('jsonwebtoken')

async function addExpense(req, res) {
    try {
        const { title, amount, category } = req.body
        if (title === '' || amount === '' || category === '') {
            return res.status(409).json({
                message: "Please Fill All the Field"
            })
        }
        const token = req.cookies.token    
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
        const data = await dataModel.create({
            title, amount, category,
            user: decoded._id
        })
        res.status(201).json({
            message: "Successfully added Expenses",
            data
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        })
    }
}

async function totalExpense(req, res) {
    try {
        const token = req.cookies.token    
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
        const allExpenses = await dataModel.find({ user: decoded._id });
        const sum = allExpenses.reduce((acc, val) => {
            return acc + val.amount;
        }, 0);
        res.status(200).json({
            message: "Total Expense is:",
            sum
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        })
    }
}
async function updateExpense(req,res){
    try {
        const {title,amount,category}=req.body
        const id=req.params.id
        const token = req.cookies.token    
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
        
        const updateExpense = await dataModel.findOneAndUpdate(
    { _id: id, user: decoded._id }, 
    { title, amount, category }, 
    { new: true }
);
        res.status(200).json({
            message: "Updated Expense are:",
            updateExpense
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        })
    }
}
async function deleteExpense(req, res) {
    try {
        const id = req.params.id;
        const token = req.cookies.token;    
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        
        const deletedExpense = await dataModel.findOneAndDelete({ 
            _id: id, 
            user: decoded._id 
        });
        
        if (!deletedExpense) {
            return res.status(404).json({
                message: "Expense not found or unauthorized"
            });
        }
        
        res.status(200).json({
            message: "Successfully deleted expense",
            deletedExpense
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}

module.exports = { addExpense, totalExpense,updateExpense,deleteExpense }