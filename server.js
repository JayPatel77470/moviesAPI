const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const moviesDB = require('./modules/moviesDB.js')
const db = new moviesDB()
const HTTP_PORT = process.env.PORT || 8080

// initialize the db and wait till the connection is established, then start the server
db.inititalize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server running at https://localhost:${HTTP_PORT}`)
    })
}).catch((err) => {
    console.log(err)
})



// middleware function that gives permission to other webpages to access our 
// data and gives us the permission to access data from other sites.
// It stand for Cross Origin Resource Sharing
app.use(cors())

// when client sends data into json format, this middleware function will 
// parse it into an object and stores into req.body
app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: "API Listening" })
})

app.post('/api/movies', (req, res) => {
    let {data} = req.body

    db.addNewMovie(data).then((movie) => {
        res.status(200).json({ message: 'Movie added successfully', movie })
    }).catch((err) => {
        res.status(500).json(err)
    })
})

app.get('/api/movies', (req, res) => {
    let { page, perPage, title } = req.query

    db.getAllMovies(page, perPage, title).then((movies) => {
        if (movies.length !== 0) {
            res.status(200).json({ movies })
        } else {
            res.status(200).json({ message: 'No movies found' })
        }
    }).catch((err) => {
        res.status(400).json({ error: err.message })
    })
})

app.get('/api/movies/:id', (req, res) => {
    let { id } = req.params

    db.getMovieById(id).then((movie) => {
       console.log(movie)
        if (movie) {
            res.status(200).json({ movie })
        } else {
            res.status(200).json({ message: 'Mo movies found' })
        }
    }).catch((err) => {
        res.status(404).json(err)
    })
})

app.put('/api/movies/:id', (req, res) => {
    let { id } = req.params
    const data = req.body

    db.updateMovieById(data, id).then((movie) => {
        res.status(200).json({ message: 'Movie updated successfully', movie })
    }).catch((err) => {
        res.status(500).json(err)
    })
})

app.delete('/api/movies/:id', (req, res) => {
    let { id } = req.params

    db.deleteMovieById(id).then((movie) => {
        res.status(200).json({ message: 'Movie deleted successfully', movie })
    }).catch((err) => {
        res.status(500).json(err)
    })
})