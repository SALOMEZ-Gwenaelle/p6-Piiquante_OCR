// Importation des packages installé dans le terminal
const bcrypt = require('bcrypt'); // Importation du package de chiffrement (pour hasher le MPD)
const jwt = require('jsonwebtoken'); // Importation du package de token d'authentification

// Importation en local
const User = require('../models/users'); // Importation du schéma users

// Function signup pour s'inscrire
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // hasher/crypter le MPD - asynchrone
        .then(hash => { // Récurération du hash du MDP
            const user = new User({ // Création d'un nouveau user pour y mettre le HASH dans la base de donnée
                email: req.body.email,
                password: hash
            });

            user.save() // Enregistrement dans la base de donnée
                .then(() => res.status(201).json({ message: 'Nouvel utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


// Function Login pour s'enregistrer
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // Vérifier si l'utilisateur existe  
        .then(user => {
            if (!user) { // si l'utilisateur n'existe pas 
                return res.status(401).json({ message: 'Paire login/mot de passe incorrect'}); // Rester vague dans l'erreur pour éviter de donner des informations = fuite de données
            }
            bcrypt.compare(req.body.password, user.password) // sinon vérifier le MDP
                .then(valid => {
                    if (!valid) { // si le MDP est faux
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' }); // Rester vague dans l'erreur pour éviter de donner des informations = fuite de données
                    }
                    res.status(200).json({ // si il est correct, on retourne un objet avec les informations nécessaires à l'authentification 
                        userId: user._id, // le user id

                        token: jwt.sign ( // le token - function de jwt avec sign
                        { userId: user._id }, //1er argument : le user id qu'on encode
                           'RANDOM_TOKEN_SECRET', //2è arguement : clé secrete pour encodage
                        { expiresIn: '24h' } // 3è arguement : expiration du token
                        )    
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};