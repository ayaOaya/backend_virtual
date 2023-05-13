require('dotenv').config() // to use enviroment variables 
const express = require('express');
const app = express();
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500


connectDB()

app.use(logger)

// to protect routes?
app.use(cors(corsOptions))

// give us the abality to process json && let our app recieve json
app.use(express.json())

// this is a 3rd party middleware[to parse cookies that we receive ]
app.use(cookieParser())


// telling the app to look for the public folder
app.use('/', express.static(path.join(__dirname, 'public'))) //express.static is middleware


app.use('/', require('./routes/root.js'))
app.use('/auth', require('./routes/authRoutes')) 
app.use('/users', require('./routes/userRoutes')) 
app.use('/notes', require('./routes/noteRoutes'))

// handelling 404 page  
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found'})
    } else {   
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})