const axios = require('axios')
const { User, Payment, Book_Model, Subscription } = require("../models");
// const { initializePayment, verifyPayment } = require('../utils/paystack')(request)
const { sendBookModelMail } = require('../utils/sendmail');
const { calculateNextPayment } = require('../utils/subscription')


const bookModel = async (req, res) => {
    try {
        const metadata = await User.findOne({
            where: {
                id: req.user.id
            }
        })

        return res.status(200).json({ metadata, purpose: "Book-Model" })
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const subscription = async (req, res) => {
    try {
        const metadata = await User.findOne({
            where: {
                id: req.user.id
            },
        })

        const sub = await Subscription.findOne({ where: { userId: req.user.id } })

        if (!sub) {
            return res.status(200).json({
                email: metadata.email,
                id: metadata.id,
                role: metadata.role,
                subscription_status: false,
                subscription_expires: "none",
                purpose: "Subscription"
            })
        } else {
            return res.status(200).json({
                email: metadata.email,
                id: metadata.id,
                role: metadata.role,
                subscription_status: sub.status,
                subscription_expires: sub.expires_in,
                purpose: "Subscription"
            })
        }


    } catch (error) {
        res.status(500).json(error.message)
    }
}

const verify = async (req, res) => {
    console.log(req.body.ref)
    const ref = req.body.ref;
    const MySecretKey = process.env.PAYSTACK_SECRET;

    try {
        const settings = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer sk_test_ae736dbdb435609cc8953caef839c9d4f6980c51',
            }
        }
        // const data = await fetch("https://api.paystack.co/transaction/verify/" + ref, settings);\
        const data = await axios({
            url: 'https://api.paystack.co/transaction/verify/' + ref,
            headers: {
                Authorization: 'Bearer sk_test_ae736dbdb435609cc8953caef839c9d4f6980c51'
            }
        })

        let response = data.data;

        if (response.data.status == "failed") {
            return res.status(200).json({ status: false })
        }

        if (response.data.status == "success") {
            const { reference, amount } = response.data;
            const { email } = response.data.customer;
            const { id, purpose, description } = response.data.metadata;

            //check if ref already exists in payment
            const checkReference = await Payment.findOne({ where: { reference } })
            if (checkReference) {
                console.log(reference)
                return res.status(200).json({ status: true })
            } else {
                //add to database
                const ref = await Payment.create({
                    userId: id,
                    amount,
                    purpose,
                    reference
                })

                if (purpose == "Book-Model") {
                    //send mail
                    sendBookModelMail(email, description);
                    //add to book model
                    const book = await Book_Model.create({
                        userId: id,
                        description,
                        success: true,
                        payment_reference: reference
                    })
                    return res.status(200).json({ status: true })
                }

                if (purpose == "Subscription") {
                    //add to subscription table
                    const sub = await Subscription.create({
                        userId: id,
                        payment_reference: reference,
                        expires_in: calculateNextPayment(Date.now())
                    })
                    return res.status(200).json({ status: true })
                }
            }
        }

    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error.message
        })
    }
}


const webhook = async (req, res) => {
    const event = req.body
    try {
        if (event.event == "charge.success" && event.data.status == "failed") {
            return res.status(200).json({ status: false })
        }

        if (event.event == "charge.success" && event.data.status == "success") {
            const { reference, amount } = event.data;
            const { email } = event.data.customer;
            const { id, purpose, description } = event.data.metadata;

            //check if ref already exists in payment
            const checkReference = await Payment.findOne({ where: { reference } })
            if (checkReference) {
                console.log(reference)
                return res.status(200).json({ status: true })
            } else {
                //add to database
                const ref = await Payment.create({
                    userId: id,
                    amount,
                    purpose,
                    reference
                })

                if (purpose == "Book-Model") {
                    //send mail
                    sendBookModelMail(email, description);
                    //add to book model
                    const book = await Book_Model.create({
                        userId: id,
                        description,
                        success: true,
                        payment_reference: reference
                    })
                    return res.status(200).json({ status: true })
                }

                if (purpose == "Subscription") {
                    //add to subscription table
                    const sub = await Subscription.create({
                        userId: id,
                        payment_reference: reference,
                        expires_in: calculateNextPayment(Date.now())
                    })
                    return res.status(200).json({ status: true })
                }
            }
        }

    } catch (error) {
        res.status(400).json({
            status: false,
            error: error.mesage
        })
    }
}


module.exports = { verify, webhook, bookModel, subscription }