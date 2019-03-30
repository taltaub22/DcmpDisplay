const express = require('express')
const router = express.Router()

const {getCurrentEvent, getAllEventMatches, getAllEventTeams} = require('../logic/tba.logic')

router.get('/matches', (req, res) => {
  getAllEventMatches(getCurrentEvent())
    .then(matches => {
      res.send(matches)
    })
    .catch(err => {
      res.status = 500
      res.send(err)
    })
})

router.get('/teams', (req, res) => {
  getAllEventTeams(getCurrentEvent())
    .then(teams => {
      res.send(teams)
    })
    .catch(err => {
      res.status = 500
      res.send(err)
    })
})

module.exports = router
