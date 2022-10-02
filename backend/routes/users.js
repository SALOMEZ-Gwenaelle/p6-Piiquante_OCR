// Importation des packages installé dans le terminal
const express = require('express'); // Importation d'EXPRESS en créant une constante avec la commande "require"

// Création d'un router
const router = express.Router(); // Importation du module ROUTER d' EXPRESS

// Importation en local
const usersCtrl = require('../controllers/users');

// Appel de la fonction de routage
router.post('/signup', usersCtrl.signup); //méthode signup
router.post('/login', usersCtrl.login); // méthode login


//Exporter ce router pour qu'on puisse y accéder depuis les autres fichiers
module.exports = router;