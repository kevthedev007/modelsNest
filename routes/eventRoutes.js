const express = require('express')
const router = express.Router()
const { verifyToken, recruiter_role } = require('../utils/verify');
const { getEvents, addEvent, getOneEvent, myEvents, deleteEvent } = require('../controllers/eventController')


router.get('/', verifyToken, getEvents)
router.post('/add-event', [verifyToken, recruiter_role], addEvent)
router.get('/event/:id', verifyToken, getOneEvent)
router.get('/my-events', [verifyToken, recruiter_role], myEvents);
router.delete('/event/:id', [verifyToken, recruiter_role], deleteEvent)




module.exports = router