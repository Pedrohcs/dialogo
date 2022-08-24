const express = require('express')
const movementController = require('../controllers/movement')

const router = express.Router()

router.post('/', createMovement)

router.get('/delete/:code', deleteMovement)

router.post('/filter', filterMovements)

router.post('/update', updateMovements)

module.exports = router

async function createMovement(req, res) {
    try {
        await movementController.createMovement(req.body)
        res.status(201).send({ 'message': 'Registered movement!' })
    } catch(error) {
        res.status(error.code  || 500).send(error.message)
    }
}

async function deleteMovement(req, res) {
    try {
        await movementController.deleteMovement(req.params.code)
        res.status(200).send({ 'message': 'Deleted movement!' })
    } catch(error) {
        res.status(error.code  || 500).send(error.message)
    }
}

async function filterMovements(req, res) {
    try {
        let filter = req.body.filter
        let sort = req.body.sort

        let movements = await movementController.getMovements(filter, sort)

        res.status(200).send(movements)
    } catch(error) {
        res.status(error.code  || 500).send(error.message)
    }
}

async function updateMovements(req, res) {
    try {
        let filter = req.body.filter
        let update = req.body.update

        await movementController.updateMovement(filter, update)

        res.status(200).send({ 'message': 'Updated movements!' })
    } catch(error) {
        res.status(error.code  || 500).send(error.message)
    }
}