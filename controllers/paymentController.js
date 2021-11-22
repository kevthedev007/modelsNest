const request = require('request');
const { User, Payment, Book_Model, Subscription } = require("../models");
const { initializePayment, verifyPayment } = require('../utils/paystack')(request)
const { sendBookModelMail } = require('../utils/sendmail');
const { calculateNextPayment } = require('../utils/subscription')

const BookPayment = async (req, res) => {
    const { description } = req.body;

    try {
        const bookModel = await Book_Model.create({ userId: req.user.id, description })

        const user = await User.findOne({
            where: {
                id: req.user.id
            }
        })

        const form = {
            email: user.email,
            amount: 1000 * 100,
        }

        form.metadata = {
            id: user.id,
            purpose: "Book-Model",
            bookingId: bookModel.id,
            description: description
        }

        initializePayment(form, (error, body) => {
            if (error) {
                console.log(error);
                return res.status(400).send('an error occured!');
            }
            let response = JSON.parse(body);
            res.redirect(response.data.authorization_url)
        });

    } catch (error) {
        res.status(400).json(error.message)
    }
}


const subscriptionPayment = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.user.id
            }
        })

        const form = {
            email: user.email,
            amount: 2000 * 100
        }

        form.metadata = {
            id: user.id,
            purpose: "Subscription"
        }

        initializePayment(form, (error, body) => {
            if (error) {
                console.log(error);
                return res.status(400).send('an error occured!');
            }
            let response = JSON.parse(body);
            res.redirect(response.data.authorization_url)
        });

    } catch (error) {
        res.status(400).json(error.message)
    }
}


const verify = async (req, res) => {
    const ref = req.query.reference;

    verifyPayment(ref, (error, body) => {
        if (error) {
            //handle errors appropriately
            console.log(error)
            return res.redirect('/error');
        }
        let response = JSON.parse(body);

        const { reference, amount } = response.data;
        const { email } = response.data.customer;
        const { id, purpose, bookingId, description } = response.data.metadata;

        const payment = Payment.build({
            userId: id,
            reference,
            amount,
            purpose
        })
        payment.save().then((success) => {
            if (!success) {
                //handle error when the donor is not found
                res.redirect('/error')
            }

            //book_model or subscription table
            if (purpose == "Book-Model") {
                console.log(description)
                //send mail
                sendBookModelMail(email, description);
                console.log('there')
                //adding payment reference in book model
                const book = Book_Model.update({ payment_reference: reference, success: true }, { where: { id: bookingId } })
                    .then((book) => console.log('book'));
            }

            if (purpose == "Subscription") {
                //add to subscription table
                const sub = Subscription.build({
                    userId: id,
                    payment_reference: reference,
                    expires_in: calculateNextPayment(Date.now())
                })
                sub.save().then((sub) => console.log('sub done'))
            }
            res.redirect('/success');
        }).catch((e) => {
            res.redirect('/error');
        })
    })
}


module.exports = { BookPayment, subscriptionPayment, verify }