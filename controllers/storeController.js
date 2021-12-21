const { User, Store, Store_Images, Models, Recruiter } = require("../models/index");
const cloudinary = require("../utils/cloudinary");

const addItem = async (req, res) => {
  const { name, size, color, price, image } = req.body;

  try {
    const result = await cloudinary.uploader.upload(image, {
      upload_preset: "store_images",
    });
    //insert in store
    const addToStore = await Store.create({
      userId: req.user.id,
      name,
      size,
      color,
      price,
      image: result.secure_url,
      public_id: result.public_id
    })

    return res.status(200).json("store item added successfully")
  } catch (error) {
    return res.status(400).json(error.message)
  }
}


const getStore = async (req, res) => {
  try {
    const stores = await Store.findAll({ raw: true, order: [['createdAt', 'DESC']] });
    if (!stores) return res.status(200).send("There are no available items now");
    return res.status(200).json(stores)

  } catch (error) {
    res.status(500).json(error.message)
  }
}


const getStoreDetails = async (req, res) => {
  const { id } = req.params;
  try {

    const store = await Store.findOne({ where: { id } })
    const images = await Store_Images.findAll({ where: { storeId: id } })

    //get the user details of the store item
    const userDetails = await User.findOne({
      where: {
        id: store.userId,
      },
      include: ['recruiter', 'model']
    })

    let user = {}

    //if product was added by model
    if (userDetails.recruiter == null) {
      user.full_name = userDetails.full_name,
        user.phone_no = userDetails.model.phone_no,
        user.state = userDetails.model.state
    }

    //if product was added by recruiter
    if (userDetails.model == null) {
      user.full_name = userDetails.full_name,
        user.phone_no = userDetails.recruiter.phone_no,
        user.state = userDetails.recruiter.state
    }

    if (req.user.id == store.userId) {
      return res.status(200).json({ user, store, images, isUser: true })
    } else {
      return res.status(200).json({ user, store, images, isUser: false })
    }

  } catch (error) {
    res.status(500).json(error.message)
  }
}

const addImages = async (req, res) => {
  const { image, id } = req.body;

  try {
    const result = await cloudinary.uploader.upload(image, {
      upload_preset: "store_images",
    });

    const uploadImage = await Store_Images.create({
      userId: req.user.id,
      storeId: id,
      image: result.secure_url,
      public_id: result.public_id
    })

    return res.status(200).json("image uploaded successfully")
  } catch (error) {
    res.status(400).json(error.message)
  }
}

const deleteStoreItem = async (req, res) => {
  const { id } = req.params;

  try {
    //delete image in cloud
    const store = await Store.findOne({ where: { id } })

    await cloudinary.uploader.destroy(store.public_id)
    const images = await Store_Images.findAll({ where: { storeId: id } })
    for (let i in images) {
      await cloudinary.uploader.destroy(images[i].public_id)
    }

    await store.destroy()
    return res.status(200).send('store item deleted successfully')
  } catch (error) {
    res.status(500).json(error.message)
  }
}

module.exports = { addItem, getStore, getStoreDetails, addImages, deleteStoreItem }
