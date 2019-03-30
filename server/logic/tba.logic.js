const axios = require('axios/index')
const BLUE_ALIIANCE_API = 'https://www.thebluealliance.com/api/v3'
const BASE_HEADERS = {
  'X-TBA-Auth-Key': 'mJu8KOhocThjpk2t0vXMWkEQkBK77nyT15GjaZZwaOsBgLgfJaUrk4TsD3p6XXe9'
}

const instance = axios.create({
  baseURL: BLUE_ALIIANCE_API,
  headers: BASE_HEADERS
})

const FIRST_ISRAEL_DISTRICT_KEY = 'isr'
const CURRENT_SEASON = 2019

const DCMP_EVENT_CODE = 'iscmp'

function getCurrentEvent () {
  const DCMP = CURRENT_SEASON + DCMP_EVENT_CODE
  return DCMP
}

function getAllEventMatches (eventKey) {
  return getTBAData(`/event/${eventKey}/matches/simple`)
    .then(matches => {
      return matches.sort((a, b) => {
        return a.match_number - b.match_number
      })
    })
}

function getAllEventTeams (eventKey) {
  return getTBAData(`/event/${eventKey}/teams/simple`)
}

function getMatchTeams (matchKey) {
  return getTBAData(`/match/${matchKey}`)
    .then(match => {
      return {
        blue: match.alliances.blue.team_keys,
        red: match.alliances.red.team_keys,
      }
    })
}

function getTBAData (path) {
  return instance.get(path, BASE_HEADERS)
    .then(data => data.data)
}

module.exports = {
  getAllEventMatches,
  getAllEventTeams,
  getCurrentEvent,
  getMatchTeams
}
