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
  if (templateData[currentView.substr(0, currentView.length - 4)]) {
    templateData[currentView.substr(0, currentView.length - 4)]()
      .then(data => {
        res.render(currentView, data)
      })

  } else {
    res.render(currentView)
  }
})

router.get('/:tempName', (req, res) => {
  templateData[req.params.tempName]().then(data => {
    res.render(req.params.tempName, data)
  })
})

module.exports = router
