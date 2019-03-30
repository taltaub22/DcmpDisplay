const {getMatchTeams} = require('../logic/tba.logic')
const {getTeamsStats} = require('./team_data')
const {eventHub} = require('../events.js')

let currentMatch = null
eventHub.on('matchChange', (match) => {
  currentMatch = match
})

module.exports = async function () {
  if (currentMatch != null) {
    let teams = await getMatchTeams(currentMatch)
    // let redStats = await getTeamsStats(teams.red)
    // let blueStats = await getTeamsStats(teams.blue)

    return {teams}
  }

  return {teams: ''}
}


