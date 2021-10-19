const { Recruiter, User } = require('../models');
const cloudinary = require('../utils/cloudinary')

const createAccount = async (req, res) => {
    const { company_name, country, state, zip, phone_no, website, fileStr } = req.body
    
    try {
        const result = await cloudinary.uploader.
        upload(fileStr, {
            upload_preset: 'documents'
        })
        console.log(result)
        const recruiter = await Recruiter.create({
            userId: req.user.id,
            company_name,
            country,
            state,
            zip,
            phone_no,
            website,
            documentId: result.public_id
        })

        return res.status(200).send('account created')
    } catch (err) {
        return res.status(500).send(err)
    }
}

const dashboard = async (req, res) => {
    try {
        const info = await User.findOne(
        {where: {id : req.user.id},
            include: 'recruiter'
        })
        return res.status(200).json(info)
    } catch (err) {
        return res.status(500).send(err)
    }
}

const allRecruiters = async (req, res) => {
    try {
        const info = await User.findAll(
        {
            include: 'recruiter'
        })
        return res.status(200).json(info)
    } catch (err) {
        return res.status(500).send(err)
    }
}


module.exports = { createAccount, dashboard, allRecruiters }