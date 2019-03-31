const axios = require('axios')
const BLUE_ALIIANCE_API = 'https://www.thebluealliance.com/api/v3'
const BASE_HEADERS = {
  'X-TBA-Auth-Key': 'mJu8KOhocThjpk2t0vXMWkEQkBK77nyT15GjaZZwaOsBgLgfJaUrk4TsD3p6XXe9'
}

const instance = axios.create({
  baseURL: BLUE_ALIIANCE_API,
  headers: BASE_HEADERS
})

const PLAYOFF_LEVELS = {
  f: 1,
  sf: 2,
  qf: 3,
  qm: 4
}

function getCurrentEvent () {
  return require('../../event_config').current_season + require('../../event_config').event_key
}

function getCurrentDistrict () {
  return require('../../event_config').district_key
}

function getCurrentSeason () {
  return require('../../event_config').current_season
}

function getAllEventMatches (eventKey) {
  return getTBAData(`/event/${eventKey}/matches/simple`)
    .then(matches => {
      let finals = []
      let sf = []
      let qf = []
      let qm = []
      for (let match of matches) {
        if (PLAYOFF_LEVELS[match.comp_level] === 1) {
          finals.push(match)
        } else if (PLAYOFF_LEVELS[match.comp_level] === 2) {
          sf.push(match)
        } else if (PLAYOFF_LEVELS[match.comp_level] === 3) {
          qf.push(match)
        } else {
          qm.push(match)
        }
      }

      let sortByMatch = (a, b) => {
        return a.match_number - b.match_number
      }

      qm = qm.sort(sortByMatch)
      qf = qf.sort(sortByMatch)
      sf = sf.sort(sortByMatch)
      finals = finals.sort(sortByMatch)

      return qm.concat(qf.concat(sf.concat(finals)))

    })
}

function getAllEventTeams (eventKey) {
  return getTBAData(`/event/${eventKey}/teams/simple`)
}

function getMatchData (matchKey) {
  return getTBAData(`/match/${matchKey}`)
    .then(match => {
      return {
        match_number: match.match_number,
        match_level: match.comp_level.toUpperCase(),
        teams: {
          blue: match.alliances.blue.team_keys,
          red: match.alliances.red.team_keys,
        }
      }
    })
}

function getTeamStatusInEvent (teamKey, eventKey) {
  return getTBAData(`/team/${teamKey}/event/${eventKey}/status`)
}

function getTeamRank (teamKey, eventKey) {
  return getTeamStatusInEvent(teamKey, eventKey)
    .then(status => {
      return status.qual.ranking.rank
    })
}

function getTeamDistrictStats (season, districtKey, teamKey) {
  const DISTRICT_RANKING_PATH = `/district/${season}${districtKey}/rankings`
  return getTBAData(DISTRICT_RANKING_PATH)
    .then(rankings => {
      return createStatsObject(rankings.filter(ranking => ranking.team_key === teamKey)[0])
    })
}

function getTeamsDistrictStats (season, districtKey, teams) {
  return Promise.all(teams.map(team => getTeamDistrictStats(season, districtKey, team)))
}

function getEventAchievement (teamKey, eventKey) {
  return getTeamWantedAwards(teamKey, eventKey)
    .then(awards => {
      if (awards.length > 0) {
        return awards[0].name
      } else {
        return GetTeamPlayoffAchievements(teamKey, eventKey)
          .then(playoff => {
            if (playoff != null) {
              return playoff
            } else {
              return getTeamRank(teamKey, eventKey)
                .then(rank => {
                  return `Rank #${rank}`
                })
            }
          })
      }
    })
}

function getTeamWantedAwards (teamKey, eventKey) {
  const WANTED_AWARDES = [0, 1, 2, 9, 10]
  return getTBAData(`/team/${teamKey}/event/${eventKey}/awards`)
    .then(awards => {
      return awards.filter(award => WANTED_AWARDES.some(wanted => wanted === award.award_type)).sort((a, b) => a.award_type - b.award_type)
    })
}

function GetTeamPlayoffAchievements (teamKey, eventKey) {
  return getTBAData(`/team/${teamKey}/event/${eventKey}/status`)
    .then(status => {
      if (status.alliance != null) {
        return removeTag(status.playoff_status_str, 'b')
      } else {
        return null
      }
    })
}

function removeTag (string, tag) {
  const OPEN_TAG = `<${tag}>`
  const CLOSE_TAG = `</${tag}>`

  string = string.split(OPEN_TAG).reduce((acc, curr) => {
    return acc += curr
  }, '')

  string = string.split(CLOSE_TAG).reduce((acc, curr) => {
    return acc += curr
  }, '')

  return string
}

function getEventName (eventKey) {
  return getTBAData(`/event/${eventKey}`)
    .then(event => {
      return event.name
    })
}

function createStatsObject (ranking) {
  console.log(`Getting data for team ${ranking.team_key}`)
  return Promise.all([getEventsName(ranking), getEventsAchievement(ranking),
                             getTeamStatusInEvent(ranking.team_key, getCurrentEvent()),
                             getTeamData(ranking.team_key)])
    .then(([events, achievements, currentStatus, team]) => {
      return {
        drank_before_dcmp: ranking.rank,
        team_number: parseInt(ranking.team_key.substr(3, ranking.team_key.length)),
        team_nickname: team.nickname,
        team_location: `${team.city}, ${team.state_prov}, ${team.country}`,
        first_d_name: events[0].name,
        first_d_ach: achievements[0],
        second_d_name: events[1].name,
        second_d_ach: achievements[1],
        dp_before_dcmp: ranking.event_points.length >= 2 ? ranking.event_points[0].total + ranking.event_points[1].total : 0,
        current_rank: currentStatus.qual.ranking.rank,
        current_record: currentStatus.qual.ranking.record,
        current_avg_rd: currentStatus.qual.ranking.sort_orders[0],
        current_next_match: currentStatus.next_match_key,
        current_next_match_str: '',
        robot_img_path: '',
      }
    })
    .then((stats)=>{
      if(stats.current_next_match !== null) {
        return getMatchData(stats.current_next_match)
          .then(match => {
            stats.current_next_match_str = `${translateLevel(match.match_level)} Match ${match.match_number}`
            return stats
          })
      }
      return stats
    })
}

function getEventsAchievement (ranking) {
  if (ranking.event_points.length >= 2) {
    return Promise.all([getEventAchievement(ranking.team_key, ranking.event_points[0].event_key),
      getEventAchievement(ranking.team_key, ranking.event_points[1].event_key)])
  } else {
    return new Promise((resolve, reject) => {
      resolve(['Did not compete', 'Did not compete'])
    })
  }
}

function getEventsName (ranking) {
  if (ranking.event_points.length >= 2) {
    return Promise.all([getEventName(ranking.event_points[0].event_key), getEventName(ranking.event_points[1].event_key)])
      .then(([ev1, ev2]) => {
        return [
          {
            key: ranking.event_points[0].event_key,
            name: ev1
          },
          {
            key: ranking.event_points[1].event_key,
            name: ev2
          }]
      })
  } else {
    return Promise.resolve([
      {
        key: 'none',
        name: 'Event #1'
      },
      {
        key: 'none',
        name: 'Event #2'
      }
    ])
  }
}

function getTeamData(teamKey){
  return getTBAData(`/team/${teamKey}/simple`)
}

function getTBAData (path) {
  return instance.get(path, BASE_HEADERS)
    .then(data => data.data)
}

function translateLevel (levelCode) {
  levelCode = levelCode.toUpperCase()

  if (levelCode === 'QM') {
    return 'Qualification'
  }

  if (levelCode === 'F') {
    return 'Final'
  }

  if (levelCode === 'QF') {
    return 'Quarter Final'
  }

  if(levelCode === 'SF'){
    return 'Semi Final'
  }
}

module.exports = {
  getAllEventMatches,
  getAllEventTeams,
  getCurrentEvent,
  getMatchData,
  getTeamStatusInEvent,
  getTeamRank,
  getTeamDistrictStats,
  getTeamsDistrictStats,
  getTeamWantedAwards,
  GetTeamPlayoffAchievements,
  getCurrentEvent,
  getCurrentDistrict,
  getCurrentSeason,
  translateLevel,
  getTeamData
}
