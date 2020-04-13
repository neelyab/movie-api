require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const MOVIES = require('./MOVIES.json')
const cors = require('cors')
const helmet = require('helmet')
const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())

// Token validation
app.use(function validateToken(req, res, next){
    const bearerToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    
    if (!bearerToken || bearerToken.split(' ')[1] !== apiToken){
        return res.status(401).json({error: 'unauthorized request'})
    }
    next()
})

app.use(cors());

//movie search
app.get('/movie', function handleMovieSearch(req, res){
    let response = MOVIES;
  
    if (req.query.genre){
        response = response.filter(movie => movie.genre.toLowerCase().includes(req.query.genre.toLowerCase()))
    }
    if (req.query.country){
        response = response.filter(movie=>
          movie.country.toLowerCase().includes(req.query.country.toLowerCase()))
    }
    if(req.query.avg_vote){
        queryNumber= Number(req.query.avg_vote)
        response = response.filter(movie=>
             Number(movie.avg_vote) >= queryNumber
        )}
    res.json(response)
})
app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })
const PORT = process.env.PORT || 8000

module.exports = app