const mongoose = require('mongoose')
const mongodbErrorHandler = require('mongoose-mongodb-errors')

mongoose.plugin(mongodbErrorHandler)


//Modele de données pour les sauces.
const sauceSchema = new mongoose.Schema({
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

sauceSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('Sauce', sauceSchema)
