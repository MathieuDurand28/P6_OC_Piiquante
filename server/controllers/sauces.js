const Sauce = require('../models/Sauces')
const fs = require("fs");

// récupération de toutes les sauces stockées en base
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}))
}

// récupération d'une sauce spécifique dans la base grâce à son ID
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};

// Création d'une sauce dans la base de données.
exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;

  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  sauce.save()
    .then(() => res.status(201).json({message: "Sauce enregistrée"}))
    .catch(error => res.status(400).json({error}))
};

// Modification d'une sauce dans la base de données.
exports.modifyOneSauce = (req, res) => {
  if (req.file) {
    Sauce.findOne({_id: req.params.id}).then(
      (sauce) => {
        if (!sauce) {
          return res.status(404).json({
            error: new Error('Sauce non trouvée !')
          })
        }
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (err => {
          if (err) console.log(err)
        }))
      }
    )
  }
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
  Sauce.updateOne({_id: req.params.id}, {
    ...sauceObject
  })
    .then(() => res.status(200).json({message: "Sauce modifiée !"}))
    .catch(error => res.status(400).json({error}))
};

// Suppression d'une sauce dans la base de données.
exports.deleteOneSauce = (req, res) => {
  Sauce.findOne({_id: req.params.id}).then(
    (sauce) => {
      if (!sauce) {
        return res.status(404).json({
          error: new Error('Sauce non trouvée !')
        })
      }
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({_id: req.params.id})
          .then(() => res.status(200).json({message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({error}));
      });
    }
  )
};

/**
 *
 * @param req
 * @param res
 * @param next
 * Systéme de like dislike des sauces.
 * SI clic sur like:
 * -- vérification qu'un like/dislike n'est pas déjà présent.
 * --- Si sauce déjà likéé/dislikée = suppression des like/dislike
 * --- Si non: incrémentation des like/dislike + ajout de l'userID dans la liste correspondante.
 */
exports.likeDislikeSauce = (req, res, next) => {

  const like = req.body.like
  const userId = req.body.userId
  const sauceId = req.params.id

  if (like === 1) {
    Sauce.findOne({_id: sauceId})
      .then((sauce) => {
        if (!sauce.usersLiked.includes(userId)) {
          Sauce.updateOne({_id: sauceId}, {
            $push: {usersLiked: userId},
            $inc: {likes: +1},
          })
            .then(() => res.status(200).json({
              message: '+1 j\'aime !'
            }))
            .catch((error) => res.status(400).json({error}))
        } else {
          res.status(400).json({message: "Vous avez déjà liké cet article"})
        }
      })
      .catch((error) => res.status(404).json({error}))
  }

  if (like === -1) {
    Sauce.findOne({_id: sauceId})
      .then((sauce) => {
        if (!sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            {_id: sauceId}, {
              $push: {usersDisliked: userId},
              $inc: {dislikes: +1},
            })
            .then(() => {
              res.status(200).json({
                message: '-1 ajouté !'
              })
            })
            .catch((error) => res.status(400).json({error}))
        } else {
          res.status(400).json({message: "Vous avez déjà disliké cet article"})
        }
      })
      .catch((error) => res.status(404).json({error}))
  }

  if (like === 0) {
    Sauce.findOne({_id: sauceId})
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne({_id: sauceId}, {
            $pull: {usersLiked: userId},
            $inc: {likes: -1},
          })
            .then(() => res.status(200).json({
              message: '+1 retiré !'
            }))
            .catch((error) => res.status(400).json({error}))
        }
        if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne({_id: sauceId}, {
            $pull: {usersDisliked: userId},
            $inc: {dislikes: -1},
          })
            .then(() => res.status(200).json({
              message: '-1 retiré !'
            }))
            .catch((error) => res.status(400).json({error}))
        }
      })
      .catch((error) => res.status(404).json({error}))
  }
};
