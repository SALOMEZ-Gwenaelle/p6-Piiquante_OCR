//Les importations installées:
const express = require('express'); // Importation d'EXPRESS en créant une constante avec la commande "require"
const mongoose = require('mongoose'); // Importation de MONGOOSE  
require('dotenv').config(); // Importation de DOTENV

// Les importations en local des routes
const saucesRoutes = require('./routes/sauces');
const usersRoutes = require('./routes/users');

//Importation pour accéder au path de notre serveur
const path = require('path');

// Connexion à la base de donnée MongoDB
mongoose.connect(`mongodb+srv://${process.env.MONGOOSE_UTILISATEUR}:${process.env.MONGOOSE_MDP}@${process.env.MONGOOSE_CLUSTER}/?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))
    
//Création de notre application via une constante
const app = express();


//CORS ; Middleware header qui permet à toutes les demandes de toutes les origines d'accéder à l'API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //Accéder à l'API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //Ajouter les headers mentionnés aux requêtes envoyées vers l'API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Envoyer des requêtes avec les méthodes mentionnées
    next();
});


//Middleware pour la lecture JSON qui remplace BODYPARSER
app.use(express.json());// Intercepte toutes les requetes JSON et met à disposition leur body sur l'objet req


//Enregistrer les routes
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', usersRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


//Exporter cette application pour qu'on puisse y accéder depuis les autres fichiers
module.exports = app;