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


//test payment
// const path = require('path');
// app.use(express.static(path.join(__dirname, "public")));
// app.set('view engine', 'ejs');
//test payment



//importing routes
const authRoutes = require('./routes/authRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes')
const modelRoutes = require('./routes/modelRoutes')
const eventRoutes = require('./routes/eventRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const storeRoutes = require('./routes/storeRoute')


//adding middlewares
app.use(cors({
    origin: '*'
}))
app.use(bodyParser.urlencoded({ extended: false, limit: '60mb' }))
app.use(bodyParser.json({ limit: '50mb' }))
// app.use(logger('dev'));
app.use(compression())

//routes
app.get('/', (req, res) => {
    res.status(200).json({ message: 'welcome to Model Nests API' })
})

// //test for payment
// app.get('/payment', (req, res) => {
//     res.render('index.ejs');
// });
// //test for payment

app.use('/auth', authRoutes)
app.use('/recruiter', recruiterRoutes)
app.use('/model', modelRoutes)
app.use('/events', eventRoutes)
app.use('/payment', paymentRoutes)
app.use('/store', storeRoutes)


app.use((req, res, next) => {
    const error = new Error('Not Found')
    res.status(404).json(`404: ${error.message}`)
})

let port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`server started at port ${port}`)
    // require('./job')
})
