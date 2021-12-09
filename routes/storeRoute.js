const express = require('express')
const router = express.Router()
const { verifyToken, model_role } = require('../utils/verify');
const { addItem, getStore, getStoreDetails, addImages, deleteStoreItem } = require('../controllers/storeController')

router.post('/add-item', [verifyToken, model_role], addItem);
router.get('/', [verifyToken, model_role], getStore);
router.get('/get-item/:id', [verifyToken, model_role], getStoreDetails);
router.post('/add-image', [verifyToken, model_role], addImages);
router.delete('/delete-item/:id', [verifyToken, model_role], deleteStoreItem);


module.exports = router;