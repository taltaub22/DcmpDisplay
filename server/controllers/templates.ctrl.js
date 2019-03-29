const express = require('express')
const router = express.Router()

const {viewChange} = require('../events.js')
const templateData = require('../templates/template_data')

let currentView = 'default'
viewChange.on('viewChange', (view) => {
  currentView = view
})

router.get('/', (req, res) => {
  if (templateData[currentView]) {
    res.render(currentView, templateData[currentView]())
  } else {
    res.render(currentView)
  }
})

router.get('/:tempName', (req, res) => {
  res.render(req.params.tempName, templateData[req.params.tempName]())
})

module.exports = router
