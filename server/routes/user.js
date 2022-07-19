const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/user')
const ExpressBrute = require('express-brute');
const passwords_strength = require('../middlewares/passwords_strength');
const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store);

router.post('/signup', passwords_strength,userCtrl.signup)
router.post('/login',
  bruteforce.prevent, // error 429 if we hit this route too often
  userCtrl.login
)

module.exports = router

