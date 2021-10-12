const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan');

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const app = express()

//importing routes
const authRoutes = require('./routes/authRoutes')



//adding middlewares
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(logger('dev'));


//routes
app.get('/', (req, res) => {
    res.status(200).json({message:'welcome to Model Nests API'})
})

app.use('/auth', authRoutes)

let port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`server started at port ${port}`)
})
