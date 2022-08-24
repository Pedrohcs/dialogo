const express = require('express')
const containerController = require('../controllers/container')

const router = express.Router()

router.post('/', createContainer)

router.get('/delete/:identificationNumber', deleteContainer)

router.post('/filter', filterContainer)

router.post('/update', updateContainer)

module.exports = router

async function createContainer(req, res) {
    try {
        await containerController.createContainer(req.body)
        res.status(201).send({ 'message': 'Registered container!' })
    } catch (error) {
        res.status(error.code || 500).send({ 'message': error.message })
    }
}

async function deleteContainer(req, res) {
    try {
        await containerController.deleteContainer(req.params.identificationNumber)
        res.status(200).send({ 'message': 'Deleted container!' })
    } catch (error) {
        res.status(error.code || 500).send({ 'message': error.message })
    }
}

async function filterContainer(req, res) {
    try {
        let filter = req.body.filter
        let sort = req.body.sort

        let containers = await containerController.getContainers(filter, sort)

        res.status(200).send(containers)
    } catch (error) {
        res.status(error.code || 500).send({ 'message': error.message })
    }
}

async function updateContainer(req, res) {
    try {
        let filter = req.body.filter
        let update = req.body.update

        await containerController.updateContainer(filter, update)

        res.status(200).send({ 'message': 'Updated container!' })
    } catch (error) {
        res.status(error.code || 500).send({ 'message': error.message })
    }
}