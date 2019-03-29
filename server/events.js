const EventEmitter = require('events');

class viewChangeEmitter extends EventEmitter {}

let viewChange = new viewChangeEmitter()


module.exports = {
  viewChange
}


