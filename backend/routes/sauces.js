// Importation des packages installé dans le terminal
const express = require('express'); // Importation d'EXPRESS en créant une constante avec la commande "require"

// Création d'un router
const router = express.Router(); // Importation du module ROUTER d' EXPRESS

// Importation en local
const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Appel de la fonction de routage
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth,  saucesCtrl.getOneSauces);
router.post('/', auth, multer, saucesCtrl.createSauces);
router.put('/:id', auth, multer, saucesCtrl.modifySauces);
router.delete('/:id', auth, saucesCtrl.deleteSauces);
router.post('/:id/like', auth, saucesCtrl.createLikeSauces);



//Exporter ce router pour qu'on puisse y accéder depuis les autres fichiers
module.exports = router;