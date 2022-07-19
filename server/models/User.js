const mongoose = require('mongoose')
const mongodbErrorHandler = require('mongoose-mongodb-errors')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.plugin(mongodbErrorHandler)


//Modéle de données pour les utilisateurs.
const userSchema = new mongoose.Schema({
  email: { type: String, required: [true, "Email obligatoire ou déjà utilisé"], unique: true },
  password: { type: String, required: [true, "Votre mot de passe doit avoir minimum 8 caractères, dont 1 majuscule, 1 minuscule, 1 chiffre et 1 symbole"] }
})

userSchema.plugin(uniqueValidator)
userSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('User', userSchema)

