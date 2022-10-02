// Importation des packages installé dans le terminal
const multer = require('multer'); // Importation de MULTER 


// Dictionnaire des extensions de fichiers
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

//Création d'un objet de configuration pour MULTER qui va gérer les fichiers entrants
const storage = multer.diskStorage({ // Enregistrement sur le disque
    destination: (req, file, callback) => { // où les images vont être enregistrés
      callback(null, 'images'); // pas d'erreur - dossier "image"
    },
    filename: (req, file, callback) => { // filename qui va expliquer à multer quel nom de fichier utiliser
      const name = file.originalname.split(' ').join('_'); //création du nom du fichier - remplacement des espaces par des "_"
      const extension = MIME_TYPES[file.mimetype]; // l'extention qui correspond à notre dictionnaire
      callback(null, name + Date.now() + '.' + extension); // création du nouveau nom avec nom original + date + extension 
    }
});


// Exportation du model
module.exports = multer({storage: storage}).single('image');