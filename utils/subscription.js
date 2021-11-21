const moment = require('moment');
const { Subscription } = require('../models/index')

function calculateNextPayment(normalDate) {
    const currentDate = moment(normalDate);
    currentDate.add(1, 'years').format('YYYY-MM-DD hh:mm')
    return currentDate;
}

//check model subscriptions
const checkSub = async (req, res, next) => {
    try {
        const check = await Subscription.findOne({
            where: {
                userId: req.user.id,
                status: true
            }
        })

        if (check) {
            next()
        } else {
            return res.status(403).send('Please subscribe to use features')
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
}

module.exports = { calculateNextPayment, checkSub }