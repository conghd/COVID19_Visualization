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

app.get('/regions2', db.getRegions2)
//app.get('/regions', db.getRegions)
app.get('/cases2', db.getCases2)
//app.get('/cases', db.getCases)
//app.get('/totalcases/:region/:from/:to', db.getTotalCases)
app.get('/totalcases2/:region/:from/:to', db.getTotalCases2)
//app.get('/totaldeaths/:region/:from/:to', db.getTotalDeaths)
app.get('/totaldeaths2/:region/:from/:to', db.getTotalDeaths2)


/*
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

*/

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
