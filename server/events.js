const EventEmitter = require('events');

class eventHubEmitter extends EventEmitter {}
let eventHub = new eventHubEmitter()


module.exports = {
  eventHub
}


