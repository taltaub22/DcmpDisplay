const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

app.set('views', path.join(__dirname, 'server/templates'))
app.set('view engine', 'EJS')

app.use(bodyParser.json())

let viewsCtrl = require('./server/controllers/views.ctrl')
app.use('/view', viewsCtrl)

let templatesCtrl = require('./server/controllers/templates.ctrl')
app.use('/template', templatesCtrl)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
