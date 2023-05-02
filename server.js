const express = require('express');
const app = express();
const path = require('path')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 3500

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

// handelling 404 page  
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404 .html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found'})
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))  