const express = require('express')
const reportController = require('../controllers/report')

const router = express.Router()

router.get('/total/movements', totalMovements)

module.exports = router

async function totalMovements(req, res) {
    try {
        let report = await reportController.totalMovements()
        res.status(200).send(report)
    } catch(error) {
        res.status(error.code || 500).send(error.message)
    }
}