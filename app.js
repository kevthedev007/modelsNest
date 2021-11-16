const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
// const logger = require('morgan')


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
    require('morgan')('dev');
}

const app = express()

//importing routes
const authRoutes = require('./routes/authRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes')
const modelRoutes = require('./routes/modelRoutes')
const eventRoutes = require('./routes/eventRoutes')


//adding middlewares
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false, limit: '60mb' }))
app.use(bodyParser.json({ limit: '50mb' }))
// app.use(logger('dev'));
app.use(compression())

//routes
app.get('/', (req, res) => {
    res.status(200).json({ message: 'welcome to Model Nests API' })
})

app.use('/auth', authRoutes)
app.use('/recruiter', recruiterRoutes)
app.use('/model', modelRoutes)
app.use('/events', eventRoutes)

let port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`server started at port ${port}`)
})
