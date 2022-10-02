// Importation des packages installé dans le terminal
const mongoose = require('mongoose'); // Importation de MONGOOSE pour créer le schéma
const uniqueValidator = require('mongoose-unique-validator'); // Importation de MONGOOSE unique validator pour valider les informations avant de les enregistrer


//Création du schéma de données avec le champ requis
const usersSchema = mongoose.Schema({
    email: {type: String, require: true, unique: true}, // adresse e-mail de l'utilisateur [unique]
    password: {type: String, required: true}, //  mot de passe de l'utilisateur haché
});

//Application du validator au schéma avant d'en faire un model
usersSchema.plugin(uniqueValidator); // methode plugin

// Exportation du model
module.exports = mongoose.model('users', usersSchema);