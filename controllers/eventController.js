const { User, Event, Recruiter } = require("../models/index");
const cloudinary = require("../utils/cloudinary");

const getEvents = async (req, res) => {
    try {
        const events = await Event.findAll();
        return res.status(200).json(events)
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const addEvent = async (req, res) => {
    const { name, address, phone_no, category, about, image, fee } = req.body;

    try {
        //add image to cloud
        const result = await cloudinary.uploader.upload(image, {
            upload_preset: "events",
        });

        const event = await Event.create({
            userId: req.user.id,
            name,
            address,
            phone_no,
            category,
            about,
            public_id: result.public_id,
            image: result.secure_url,
            fee,
        });

        return res.status(200).send('Event added successfully!')
    } catch (error) {
        res.status(400).json(error.message);
    }
};

const getOneEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findOne({ where: { id } })

        return res.status(200).json(event)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const myEvents = async (req, res) => {
    try {
        const events = await Event.findAll({ where: { userId: req.user.id } })
        return res.status(200).json(events)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

const deleteEvent = async (req, res) => {
    const { id } = req.params

    try {
        // const event = await Event.destroy({ where: { id } })

        //delete image in cloud
        const event = await Event.findOne({ where: { id } })
        await cloudinary.uploader.destroy(event.image)

        await event.destroy()
        return res.status(200).send('Event deleted successfully')
    } catch (error) {
        res.status(500).json(error.message)
    }
}

module.exports = { getEvents, addEvent, getOneEvent, myEvents, deleteEvent }
