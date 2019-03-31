const {getMatchData} = require('../logic/tba.logic')
const {getTeamsStats} = require('./team_data')
const {eventHub} = require('../events.js')

let currentMatch = null
eventHub.on('matchChange', (match) => {
  currentMatch = match
})

module.exports = async function () {
  if (currentMatch != null) {
    let match = await getMatchData(currentMatch)
    let teams = match.teams
    let redStats = await getTeamsStats(teams.red)
    let blueStats = await getTeamsStats(teams.blue)

    let stats = {
      red: [],
      blue: []
    }

    stats.red[0]=redStats.filter(stat=>'frc'+stat.team_number === teams.red[0])[0]
    stats.red[1]=redStats.filter(stat=>'frc'+stat.team_number === teams.red[1])[0]
    stats.red[2]=redStats.filter(stat=>'frc'+stat.team_number === teams.red[2])[0]

    stats.blue[0]=blueStats.filter(stat=>'frc'+stat.team_number === teams.blue[0])[0]
    stats.blue[1]=blueStats.filter(stat=>'frc'+stat.team_number === teams.blue[1])[0]
    stats.blue[2]=blueStats.filter(stat=>'frc'+stat.team_number === teams.blue[2])[0]

    let matchData = {
      number: match.match_number,
      level: translateLevel(match.match_level)
    }

    return {stats, matchData}
  }

  return {stats: ''}
}

function translateLevel(levelCode){
  levelCode = levelCode.toUpperCase();

  if(levelCode === 'QM'){
    return 'Qualification'
  }

  if(levelCode ==='F'){
    return 'Final'
  }

}

