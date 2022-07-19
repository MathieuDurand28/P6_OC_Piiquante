const express = require("express")
const mongoose = require('mongoose')
const helmet = require('helmet')
const path = require('path')
require('dotenv').config()
const app = express();
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

/**
 * Connexion à la base de données MongoDB
 */
mongoose.connect(process.env.BDD_ACCESS,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/**
 * sécurisation des en-têtes HTTP
 */
app.use(helmet ({
  contentSecurityPolicy: false
}))


/**
 * Autorisation de connexion entre les clients et le serveur
 * contournement des erreurs CORS
 */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Commande permettant la réception des données du client en JSON.
app.use(express.json());

/**
 * Routage des requêtes vers la bonne configuration de routes.
 */
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);


module.exports = app;





