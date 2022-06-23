const Sauce = require('../models/Sauces')
const fs = require("fs");


exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}))
}

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};

exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;

  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  sauce.save()
    .then(() => res.status(201).json({message: "Sauce enregistrée"}))
    .catch(error => res.status(400).json({error}))
};

exports.modifyOneSauce = (req, res) => {
  if (req.file){
    Sauce.findOne({_id: req.params.id}).then(
      (sauce) => {
        if (!sauce) {
          return res.status(404).json({
            error: new Error('Sauce non trouvée !')
          })
        }
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`,(err => {
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
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    }
  )
};

exports.likeDislikeSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id}).then(
    (sauce) => {
      if (!sauce) {
        return res.status(404).json({
          error: new Error('Sauce non trouvée !')
        })
      }
      if (req.body.like === 0){
        if (sauce.usersLiked.indexOf(req.body.userId) > -1){
          sauce.usersLiked.slice(sauce.usersLiked.indexOf(req.body.userId),1)
          Sauce.updateOne({_id: req.params.id}, {
            $pull : { usersLiked : req.body.userId },
            likes: (sauce.likes === 0) ? 0 : -1
          })
            .then(() => res.status(200).json({message: "appréciation mise à jour"})
            .catch(error => res.status(400).json({error})))

        } else if (sauce.usersDisliked.indexOf(req.body.userId) > -1){
          sauce.usersDisliked.slice(sauce.usersDisliked.indexOf(req.body.userId),1)
          Sauce.updateOne({_id: req.params.id}, {
            $pull : { usersDisliked : req.body.userId },
            dislikes: (sauce.dislikes === 0) ? 0 : +1
          })
            .then(() => res.status(200).json({message: "appréciation mise à jour"})
              .catch(error => res.status(400).json({error})))
        }
      } else if (req.body.like === 1){
        Sauce.updateOne({_id: req.params.id}, {
          $push : { usersLiked : req.body.userId },
          likes: sauce.likes + 1
        })
          .then(() => res.status(200).json({message: "+1 j'aime"}))
          .catch(error => res.status(400).json({error}))

      } else if (req.body.like === -1) {
        Sauce.updateOne({_id: req.params.id}, {
          $push : { usersDisliked : req.body.userId },
          dislikes: sauce.dislikes -1
        })
          .then(() => res.status(200).json({message: "-1 j'aime"}))
          .catch(error => res.status(400).json({error}))
      }

    }
  )
};
