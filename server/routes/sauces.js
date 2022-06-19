const express = require('express')
const router = express.Router()


const multer = require('../middleware/multer-config')
const sauceCtrl = require('../controllers/sauces')




router.get('/', sauceCtrl.getAllSauces)
router.get('/:id', sauceCtrl.getOneSauce)
router.post('/', multer,sauceCtrl.createSauce)
router.put('/:id', sauceCtrl.modifyOneSauce)
router.delete('/:id', sauceCtrl.deleteOneSauce)

router.post('/:id/like', sauceCtrl.likeDislikeSauce)

module.exports = router
