const axios = require('axios/index')
const fs = require('fs')

const BLUE_ALIIANCE_API = 'https://www.thebluealliance.com/api/v3'
const BASE_HEADERS = {
  'X-TBA-Auth-Key': 'mJu8KOhocThjpk2t0vXMWkEQkBK77nyT15GjaZZwaOsBgLgfJaUrk4TsD3p6XXe9'
}

const instance = axios.create({
  baseURL: BLUE_ALIIANCE_API,
  headers: BASE_HEADERS
})

const FIRST_ISRAEL_DISTRICT_KEY = 'isr'

const STATUS_PATH = '/status'
getTBAData(STATUS_PATH)
  .then(status => {

    const currentSeason = status.current_season

    const DISTRICT_RANKING_PATH = `/district/${currentSeason}${FIRST_ISRAEL_DISTRICT_KEY}/rankings`
    getTBAData(DISTRICT_RANKING_PATH)
      .then(rankings => {
        let stats = []
        for (let ranking of rankings) {
          stats.push(createStatsObject(ranking))
        }

        Promise.all(stats).then(allStats => {
          allStats.sort((a, b) => a.drank_before_dcmp - b.drank_before_dcmp)
          writeCSV(allStats, 'testCsv.csv')
        })
      })

  })

function getTBAData (path) {
  return instance.get(BLUE_ALIIANCE_API + path, BASE_HEADERS)
    .then(data => data.data)
}

function createStatsObject (ranking) {
  console.log(`Getting data for team ${ranking.team_key}`)
  return Promise.all([getEventsName(ranking), getEventsAchievement(ranking)])
    .then(([events, Achievements]) => {
      getEventAchievement(ranking.team_key, events[1].key)
      return {
        drank_before_dcmp: ranking.rank,
        team_number: parseInt(ranking.team_key.substr(3, ranking.team_key.length)),
        first_d_name: events[0].name,
        first_d_ach: Achievements[0],
        second_d_name: events[1].name,
        second_d_ach: Achievements[1],
        dp_before_dcmp: ranking.event_points.length > 0 ? ranking.event_points[0].total + ranking.event_points[1].total : 0,
        robot_img_path: '',
      }
    })

}

function getEventsName (ranking) {
  if (ranking.event_points.length > 0) {
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
    return new Promise((resolve, reject) => {
      resolve(['Did not compete', 'Did not compete'])
    })
  }
}

function getEventsAchievement (ranking) {
  if (ranking.event_points.length > 0) {
    return Promise.all([getEventAchievement(ranking.team_key, ranking.event_points[0].event_key),
      getEventAchievement(ranking.team_key, ranking.event_points[1].event_key)])
  } else {
    return new Promise((resolve, reject) => {
      resolve(['Did not compete', 'Did not compete'])
    })
  }
}

function getEventName (eventKey) {
  return getTBAData(`/event/${eventKey}`)
    .then(event => {
      return event.name
    })
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

function getTeamRank (teamKey, eventKey) {
  return getTBAData(`/team/${teamKey}/event/${eventKey}/status`)
    .then(status => {
      return status.qual.ranking.rank
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

function createCsvRecord (statsRecord) {
  return [
    statsRecord.drank_before_dcmp,
    statsRecord.team_number,
    statsRecord.first_d_name,
    statsRecord.first_d_ach,
    statsRecord.second_d_name,
    statsRecord.second_d_ach,
    statsRecord.dp_before_dcmp,
    statsRecord.robot_img_path]
}

function writeCSV (allStats, filename) {
  fs.writeFile(`./${filename}`, allStats.map(createCsvRecord).join('\r\n'), (err) => {
    if (err) console.error(err)
    console.log('All Done!')
  })
}


