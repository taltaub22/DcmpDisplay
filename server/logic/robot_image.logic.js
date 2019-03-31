const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')

const BASE_PATH = '/robotImages'
const FOLDER_PATH = '../../public/robotImages'

function getRobotImagePath (teamNumber) {
  return fs.readdirAsync(path.join(__dirname, FOLDER_PATH))
    .then(files => {
      if (files.some(file => file.includes('frc' + teamNumber))) {
        return `${BASE_PATH}/${files.filter(file => file.includes('frc' + teamNumber))}`
      } else {
        return `${BASE_PATH}/default.png`
      }
    })
}

module.exports = {
  getRobotImagePath
}
