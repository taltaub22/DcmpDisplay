const express = require('express')
const router = express.Router()

const {eventHub} = require('../events.js')
const templateData = require('../templates/template_data.js')

let currentView = 'default.ejs'
eventHub.on('currentView', (view) => {
  currentView = view
})

router.get('/', (req, res) => {
  console.log(`Getting view: ${currentView}`)
  if (templateData[currentView.substr(0, currentView.length-4)]) {
    res.render(currentView, templateData[currentView.substr(0, currentView.length-4)]())
  } else {
    res.render(currentView)
  }
})

router.get('/:tempName', (req, res) => {
  res.render(req.params.tempName, templateData[req.params.tempName]())
})

module.exports = router
