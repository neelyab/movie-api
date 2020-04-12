require('dotenv').config()

const express = require('express')

const morgan = require('morgan')

const MOVIES = require('./MOVIES.json')

const cors = require('cors')

const helmet = require('helmet')

const app = express()

app.use(morgan('dev'))
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

const PORT = 8000

app.listen(PORT, ()=>{
    console.log(`Server listening at http://localhost:${PORT}`)
})