const { Models, User, Document, Social_Media, Event, Media } = require('../models');
const cloudinary = require('../utils/cloudinary')


const createAccount = async (req, res, next) => {
    console.log(req.body)
    const { age, complexion, body_size, bust, waist, hips, height, category, country, state, zip, phone_no, fileStr } = req.body

    //check if model already has an account
    const check = await Models.findOne({ where: { userId: req.user.id } })
    if (check) return res.status(400).send('Model already has an account')

    try {
        const result = await cloudinary.uploader.
            upload(fileStr, {
                upload_preset: 'documents'
            })

        const model = await Models.create({ userId: req.user.id, age, complexion, body_size, bust, waist, hips, height, category, country, state, zip, phone_no })

        const addDocument = await Document.create({
            userId: req.user.id,
            image: result.secure_url,
            public_id: result.public_id
        })
        return res.status(200).send('account created')
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

const dashboard = async (req, res, next) => {
    try {
        const info = await User.findOne(
            {
                where: { id: req.user.id },
                include: ['model', 'document', 'social_media']
            })

        //get events
        const events = await Event.findAll({ limit: 5 })

        const eventInfo = events.map(event => {
            return {
                id: event.id,
                name: event.name,
                image: event.image
            }
        })

        return res.status(200).json({
            info: {
                full_name: info.full_name,
                role: info.role,
                profile_image: info.model.profile_image,
                document: info.document,
                social_media: info.social_media
            },
            events: eventInfo
        });


    } catch (error) {
        return res.status(500).send(error.message)
    }
}

const getSocials = async (req, res) => {
    try {
        const details = await User.findOne({
            where: {
                id: req.user.id
            },
            include: ['model', 'social_media']
        })

        return res.status(200).json({
            full_name: details.full_name,
            profile_image: details.model.profile_image,
            phone_no: details.model.phone_no,
            subscription_status: false,
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

        const user = await Models.findOne({ where: { userId: req.user.id } })

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

const uploadImage = async (req, res) => {
    const { image } = req.body;

    try {
        const result = await cloudinary.uploader.upload(image, {
            upload_preset: "images",
        });

        const uploadImage = await Media.create({
            userId: req.user.id,
            image: result.secure_url,
            public_id: result.public_id
        })

        res.status(200).send('Image uploaded successfully')
    } catch (error) {
        res.status(400).json(error.message)
    }
}

const getDetails = async (req, res) => {
    try {
        const details = await User.findOne({
            where: { id: req.user.id },
            include: 'model'
        })
        return res.status(200).json({
            details: {
                full_name: details.full_name,
                profile_image: details.model.profile_image,
                age: details.model.age,
                bodysize: details.model.body_size,
                waist: details.model.waist,
                height: details.model.height,
                complexion: details.model.complexion,
                bust: details.model.bust,
                hips: details.model.hips,
                category: details.model.category,
                country: details.model.country,
            }
        })
    } catch (error) {
        res.status(400).json(error.message)
    }
}

const editDetails = async (req, res) => {
    try {
        const match = {};

        if (req.body.age) {
            match.age = req.body.age
        }

        if (req.body.body_size) {
            match.body_size = req.body.body_size
        }

        if (req.body.waist) {
            match.waist = req.body.waist
        }

        if (req.body.height) {
            match.height = req.body.height
        }

        if (req.body.complexion) {
            match.complexion = req.body.complexion
        }

        if (req.body.bust) {
            match.bust = req.body.bust
        }

        if (req.body.hips) {
            match.hips = req.body.hips
        }

        if (req.body.category) {
            match.category = req.body.category
        }

        if (req.body.country) {
            match.country = req.body.country
        }

        const edit = await Models.update(match, { where: { userId: req.user.id } })
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

const getMedia = async (req, res) => {
    try {
        const media = await Media.findAll({ where: { userId: req.user.id } })
        return res.status(200).json(media)

    } catch (error) {
        res.status(500).json(error.message)
    }
}


const deleteMedia = async (req, res) => {
    const { id } = req.params;

    try {
        const image = await Media.findOne({
            where: {
                id: id,
                userId: req.user.id,
            }
        })

        await cloudinary.uploader.destroy(image.public_id);

        await image.destroy()

        return res.status(200).json('Image deleted from media successfully')

    } catch (error) {
        res.status(400).json(error.message)
    }
}

const getOneModel = async (req, res) => {
    const { id } = req.params
    try {
        const model = await User.findOne({
            where: {
                id: id,
                role: 'model'
            },
            include: 'model'
        })

        return res.status(200).json(model)
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
    uploadImage,
    getDetails,
    editDetails,
    changePassword,
    getMedia,
    deleteMedia,
    getOneModel
}