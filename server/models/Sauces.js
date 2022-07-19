const mongoose = require('mongoose')

//Modele de données pour les sauces.
const sauceSchema = mongoose.Schema({
  userId: {type: String},
  name: {type: String},
  manufacturer: {type: String},
  description: {type: String},
  mainPepper: {type: String},
  imageUrl: {type: String},
  heat: {type: Number, default: 0},
  likes: {type: Number, default: 0},
  dislikes: {type: Number, default: 0},
  usersLiked : { type : Array , "default" : [] },
  usersDisliked : { type : Array , "default" : [] },
})


module.exports = mongoose.model('Sauce', sauceSchema)
