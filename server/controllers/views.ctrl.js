const express = require('express')
const router = express.Router()

const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')

const {eventHub} = require('../events.js')

router.get('/', (req, res) => {
  fs.readdirAsync(path.join(__dirname, '../templates')).then(data => {
    res.send(data.filter(name=>name.includes('.ejs')))
  })
})

router.post('/', (req, res) => {
  let newView = req.body.view
  console.log(`New view was chosen: ${newView}`)
  eventHub.emit('currentView', newView)
  res.sendStatus(200)
})

module.exports = router
