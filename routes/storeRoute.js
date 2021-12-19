const express = require('express')
const router = express.Router()
const { verifyToken, model_role } = require('../utils/verify');
const { addItem, getStore, getStoreDetails, addImages, deleteStoreItem } = require('../controllers/storeController')

router.post('/add-item', verifyToken, addItem);
router.get('/', getStore);
router.get('/get-item/:id', verifyToken, getStoreDetails);
router.post('/add-image', verifyToken, addImages);
router.delete('/delete-item/:id', verifyToken, deleteStoreItem);


module.exports = router;