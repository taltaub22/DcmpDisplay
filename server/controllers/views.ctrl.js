const express = require('express')
const router = express.Router()

const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')

const {viewChange} = require('../events.js')

router.get('/', (req, res) => {
  fs.readdirAsync(path.join(__dirname, '../templates')).then(data => {
    res.send(data)
  })
})

router.post('/', (req, res) => {
  let newView = req.body.view
  viewChange.emit('viewChange', newView)
  res.sendStatus(200)
})

module.exports = router
