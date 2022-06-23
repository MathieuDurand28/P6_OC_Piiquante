const express = require('express')
const router = express.Router()

const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer-config')
const sauceCtrl = require('../controllers/sauces')




router.get('/', sauceCtrl.getAllSauces)
router.get('/:id', sauceCtrl.getOneSauce)
router.post('/', multer,sauceCtrl.createSauce)
router.put('/:id', auth,multer,sauceCtrl.modifyOneSauce)
router.delete('/:id', auth,multer,sauceCtrl.deleteOneSauce)

router.post('/:id/like', sauceCtrl.likeDislikeSauce)

module.exports = router
