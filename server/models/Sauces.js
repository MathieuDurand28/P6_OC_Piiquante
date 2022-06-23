const mongoose = require('mongoose')

const sauceSchema = mongoose.Schema({
  userId: {type: String},
  name: {type: String},
  manufacturer: {type: String},
  description: {type: String},
  mainPepper: {type: String},
  imageUrl: {type: String},
  heat: {type: Number},
  likes: {type: Number},
  dislikes: {type: Number},
  usersLiked : { type : Array , "default" : [] },
  usersDisliked : { type : Array , "default" : [] },
})


module.exports = mongoose.model('Sauce', sauceSchema)


/**
 * email: { type: String, required: true, unique: true },
 *   password: { type: String, required: true }
 */
