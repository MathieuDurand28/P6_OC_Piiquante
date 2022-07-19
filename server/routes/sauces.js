const express = require('express')
const router = express.Router()

const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer-config')
const sauceCtrl = require('../controllers/sauces')




router.get('/', auth,sauceCtrl.getAllSauces)
router.get('/:id', auth,sauceCtrl.getOneSauce)
router.post('/', auth,multer,sauceCtrl.createSauce)
router.put('/:id', auth,multer,sauceCtrl.modifyOneSauce)
router.delete('/:id', auth,sauceCtrl.deleteOneSauce)

router.post('/:id/like', auth,sauceCtrl.likeDislikeSauce)

module.exports = router
