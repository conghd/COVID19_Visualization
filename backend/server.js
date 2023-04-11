const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
const app = express()
const db = require('./queries')
const port = 3001

app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/regions', db.getRegions)
app.get('/cases', db.getCases)
app.get('/totalcases/:region_id/:from/:to', db.getTotalCases)
app.get('/totaldeaths/:region_id/:from/:to', db.getTotalDeaths)


/*
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

*/

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
