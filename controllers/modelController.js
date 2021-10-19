const { Models, User } = require('../models');
const cloudinary = require('../utils/cloudinary')


const createAccount = async (req, res, next) => {
    const { age, complexion, body_size, bust, waist, hips, height, category, country, state, zip, phone_no, fileStr } = req.body
    console.log(age, complexion)
    try {
        const result = await cloudinary.uploader.
            upload(fileStr, {
                upload_preset: 'documents'
            })

        console.log(result)

        const model = await Models.create({ userId: req.user.id, age, complexion, body_size, bust, waist, hips, height, category, country, state, zip, phone_no, documentId: result.public_id })

        return res.status(200).send('account created')
    } catch (err) {
        return res.status(500).send(err)
    }
}

const dashboard = async (req, res, next) => {
    try {
        const info = await User.findOne(
            {
                where: { id: req.user.id },
                include: 'model'
            })
        return res.status(200).json(info)
    } catch (err) {
        return res.status(500).send(err)
    }
}



module.exports = { createAccount, dashboard }