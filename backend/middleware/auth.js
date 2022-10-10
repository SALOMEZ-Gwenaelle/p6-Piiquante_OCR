// Importation des packages installé dans le terminal
const jwt = require('jsonwebtoken'); // Importation du package de token d'authentification
require('dotenv').config(); // Importation de DOTENV

// exporter la fonction 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; // Récupération du token
       const decodedToken = jwt.verify(token, process.env.JWT_TOKEN); // décoder le token avec la méthode verify de jwt
       const userId = decodedToken.userId; // Récupération le userID spécifique
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};