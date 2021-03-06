const { Recruiter, User, Document, Social_Media, Models, Sequelize } = require("../models");
const cloudinary = require("../utils/cloudinary");
const bcrypt = require('bcrypt');
const sequelize = require('sequelize');

const createAccount = async (req, res) => {
    const { company_name, country, state, zip, phone_no, website, fileStr } = req.body;

    //check if recruiter already has an account
    const check = await Recruiter.findOne({ where: { userId: req.user.id } });
    if (check) return res.status(400).send("Recruiter already has an account");

    try {
        const result = await cloudinary.uploader.upload(fileStr, {
            upload_preset: "documents",
        });

        //insert in recruiter table
        const recruiter = await Recruiter.create({
            userId: req.user.id,
            company_name,
            country,
            state,
            zip,
            phone_no,
            website,
        });

        //insert document in document table
        const addDocument = await Document.create({
            userId: req.user.id,
            public_id: result.public_id,
            image: result.secure_url
        });

        return res.status(200).send("account created");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const dashboard = async (req, res) => {
    try {
        const info = await User.findOne({
            where: { id: req.user.id },
            include: ['recruiter', 'document', 'social_media'],
        });

        //get 5 models
        const models = await Models.findAll({
            include: 'user',
            limit: 5
        })

        const modelsInfo = models.map(model => {
            return {
                id: model.userId,
                full_name: model.user.full_name,
                profile_image: model.profile_image
            }
        })

        return res.status(200).json({
            info: {
                full_name: info.full_name,
                role: info.role,
                profile_image: info.recruiter.profile_image,
                document: info.document,
                social_media: info.social_media
            },
            models: modelsInfo
        });

    } catch (error) {
        return res.status(500).json(error.message);
    }
};


const getSocials = async (req, res) => {
    try {
        const details = await User.findOne({
            where: {
                id: req.user.id
            },
            include: ['recruiter', 'social_media']
        })

        return res.status(200).json({
            full_name: details.full_name,
            profile_image: details.recruiter.profile_image,
            phone_no: details.recruiter.phone_no,
            social_media: details.social_media
        })
    } catch (error) {
        return res.status(500).send(error.message);
    }
}


const editSocials = async (req, res) => {
    const { twitter, instagram, facebook, tiktok } = req.body;

    try {
        //if social_media hasnt been provided
        const check = await Social_Media.findOne({ where: { userId: req.user.id } })
        if (!check) {
            const addSocial = await Social_Media.create({ userId: req.user.id, twitter, instagram, facebook, tiktok })

            return res.status(200).send('Accounts Added Successfully')
        }

        //update social media details
        const match = {};

        if (req.body.twitter) {
            match.twitter = req.body.twitter
        }

        if (req.body.instagram) {
            match.instagram = req.body.instagram
        }

        if (req.body.facebook) {
            match.facebook = req.body.facebook
        }

        if (req.body.tiktok) {
            match.tiktok = req.body.tiktok
        }

        const edit = await Social_Media.update(match, { where: { userId: req.user.id } })
        return res.status(200).send('Accounts Updated Successful')

    } catch (error) {
        res.status(400).json(error.message)
    }
}

const profileImage = async (req, res) => {
    const { image } = req.body;

    try {

        const user = await Recruiter.findOne({ where: { userId: req.user.id } })

        if (user.profile_image) await cloudinary.uploader.destroy(user.public_id)

        const result = await cloudinary.uploader.upload(image, {
            upload_preset: "profile-image",
        });

        user.profile_image = result.secure_url;
        user.public_id = result.public_id;
        await user.save()

        return res.status(200).send('Profile Image Updated Successfully!')
    } catch (error) {
        res.status(400).json(error.message)
    }
}

const getDetails = async (req, res) => {
    try {
        const details = await User.findOne({
            where: { id: req.user.id },
            include: 'recruiter'
        })
        return res.status(200).json({
            details: {
                full_name: details.full_name,
                profile_image: details.recruiter.profile_image,
                company_name: details.recruiter.company_name,
                country: details.recruiter.country,
                phone_no: details.recruiter.phone_no,
                website: details.recruiter.website,
            }
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
}


const editDetails = async (req, res) => {
    try {
        const match = {};

        if (req.body.company_name) {
            match.company_name = req.body.company_name
        }

        if (req.body.country) {
            match.country = req.body.country

        }
        if (req.body.phone_no) {
            match.phone_no = req.body.phone_no
        }
        if (req.body.website) {
            match.website = req.body.website
        }

        const edit = await Recruiter.update(match, { where: { userId: req.user.id } })
        return res.status(200).send('Update Successful')

    } catch (error) {
        res.status(400).json(error.message)
    }
}

const changePassword = async (req, res) => {
    const old_password = req.body.old_password.toLowerCase()
    const new_password = req.body.new_password.toLowerCase()
    const confirm_password = req.body.confirm_password.toLowerCase()

    try {
        //check if old_password is correct
        const user = await User.findOne({
            where: {
                id: req.user.id
            }
        })

        const checkPassword = await bcrypt.compare(old_password, user.password)
        if (!checkPassword) return res.status(400).send('Invalid Password')

        if (new_password !== confirm_password) return res.status(400).send('Password does not match')

        //update password
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(new_password, salt)
        user.password = newPassword
        await user.save()

        return res.status(200).send('Password changed successfully!')

    } catch (error) {
        res.status(400).json(error.message)
    }
}

const getModels = async (req, res) => {

    try {
        //get all models
        const models = await Models.findAll({
            include: 'user',
        })

        const modelsInfo = models.map(model => {
            return {
                id: model.userId,
                full_name: model.user.full_name,
                profile_image: model.profile_image,
                age: model.age,
                size: model.body_size,
                state: model.state,
                complexion: model.complexion
            }
        })

        return res.status(200).json(modelsInfo)
    } catch (error) {
        res.status(400).json(error.message)
    }
}

const search = async (req, res) => {
    const name = req.query.name

    try {
        const users = await User.findAll({
            where: {
                full_name: sequelize.where(sequelize.fn('LOWER', sequelize.col('full_name')), 'LIKE', '%' + name.toLowerCase() + '%'),
                role: 'model'
            },
        })

        //check if model is fully registered and return the model
        if (users && users.length > 0) {
            let models = [];
            for (let i = 0; i < users.length; i++) {
                const model = await Models.findOne({
                    where:
                        { userId: users[i].id },
                    include: 'user'
                })
                if (model) {
                    models.push(model)
                } else {
                    return res.status(200).send('model does not exist')
                }
            }
            return res.status(200).json(models)
        }

        return res.status(200).send('model does not exist')
    } catch (error) {
        res.status(400).json(error.message)
    }
}

const getOneRecruiter = async (req, res) => {
    const { id } = req.params
    try {
        const recruiter = await User.findOne({
            where: {
                id: id,
                role: 'recruiter'
            },
            include: 'recruiter'
        })

        return res.status(200).json(recruiter)
    } catch (error) {
        res.status(400).json(error.message)
    }
}



module.exports = {
    createAccount,
    dashboard,
    getSocials,
    editSocials,
    profileImage,
    getDetails,
    editDetails,
    changePassword,
    getModels,
    search,
    getOneRecruiter
};
