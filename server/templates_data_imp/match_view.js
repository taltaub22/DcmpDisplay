const {getCurrentEvent, getCurrentDistrict, getCurrentSeason, getMatchData, getTeamsDistrictStats, translateLevel} = require('../logic/tba.logic')
const {getRobotImagePath} = require('../logic/robot_image.logic')
const {eventHub} = require('../events.js')

let currentMatch = null
eventHub.on('matchChange', (match) => {
  currentMatch = match
})

module.exports = function () {
  if (currentMatch != null) {
    return getMatchData(currentMatch)
      .then(match => {
        let teams = match.teams
        return Promise.all([getTeamsDistrictStats(getCurrentSeason(), getCurrentDistrict(), teams.red),
                                   getTeamsDistrictStats(getCurrentSeason(), getCurrentDistrict(), teams.blue)])
          .then(([redStats, blueStats]) => {

            let stats = {
              red: [],
              blue: []
            }

            stats.red[0] = redStats.filter(stat => 'frc' + stat.team_number === teams.red[0])[0]
            stats.red[1] = redStats.filter(stat => 'frc' + stat.team_number === teams.red[1])[0]
            stats.red[2] = redStats.filter(stat => 'frc' + stat.team_number === teams.red[2])[0]
            stats.blue[0] = blueStats.filter(stat => 'frc' + stat.team_number === teams.blue[0])[0]
            stats.blue[1] = blueStats.filter(stat => 'frc' + stat.team_number === teams.blue[1])[0]
            stats.blue[2] = blueStats.filter(stat => 'frc' + stat.team_number === teams.blue[2])[0]

            let matchData = {
              number: match.match_number,
              level: translateLevel(match.match_level)
            }

            return {stats, matchData}
          }).then(({stats, matchData}) => {
            return Promise.all([getRobotImagePath(stats.red[0].team_number),
              getRobotImagePath(stats.red[1].team_number),
              getRobotImagePath(stats.red[2].team_number),
              getRobotImagePath(stats.blue[0].team_number),
              getRobotImagePath(stats.blue[1].team_number),
              getRobotImagePath(stats.blue[2].team_number)])
              .then(([red1, red2, red3, blue1, blue2, blue3]) => {
                stats.red[0].robot_img_path = red1
                stats.red[1].robot_img_path = red2
                stats.red[2].robot_img_path = red3
                stats.blue[0].robot_img_path = blue1
                stats.blue[1].robot_img_path = blue2
                stats.blue[2].robot_img_path = blue3

                return {stats, matchData}
              })
          })
      })
  } else {
    return Promise.resolve({stats: ''})
  }
}


