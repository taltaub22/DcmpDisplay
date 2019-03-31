const express = require('express')
const router = express.Router()

const {eventHub} = require('../events.js')
const {getCurrentEvent, getAllEventMatches, getAllEventTeams, getTeamStats} = require('../logic/tba.logic')

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

router.post('/matches', (req, res) => {
  let body = req.body.match
  eventHub.emit('matchChange', body)
  res.sendStatus(200)
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

router.post('/teams', (req, res) => {
  let body = req.body.team
  eventHub.emit('teamChange', body)
  getTeamStats(body)
    .then(stats => {
      res.send(stats)
    })
    .catch(err => {
      res.status = 500
      res.send(err.message)
    })
})

module.exports = router
