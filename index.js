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

let tbaCtrl = require('./server/controllers/tba.ctrl')
app.use('/tba', tbaCtrl)

let dashboardCtrl = require('./server/controllers/client.ctrl')
app.use(express.static(path.join(__dirname, 'dist')))
app.use('/dashboard', dashboardCtrl)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
