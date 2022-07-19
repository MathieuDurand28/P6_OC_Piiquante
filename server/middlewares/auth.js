const jwt = require('jsonwebtoken')
require('dotenv').config()

/**
 *
 * @param req
 * @param res
 * @param next
 * recuperation et comparaison du token avec la clef secrete pour identifier un utilisateur.
 */
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY)
    const userId = decodedToken.userId
    req.auth = { userId }
    if (req.body.userId && req.body.userId !== userId){
      throw 'UserId non valable !'
    } else {
      next()
    }
  } catch (error){
    res.status(401).json({error: error | "Requête non authentifiée !"})
  }
}
