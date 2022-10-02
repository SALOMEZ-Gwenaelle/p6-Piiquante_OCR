// Importation des packages installé dans le terminal
const sauce = require('../models/sauces') // Importation du schéma des sauces


//Récupèrer/Afficher un tableau de toutes les sauces de la base de données
exports.getAllSauces = (req, res, next) => {
    sauce.find() // Méthode find pour renvoyer un tableau contenant tous les objets (sauce) dans la base de données
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};


//Récupérer/Afficher une sauce spécifique 
exports.getOneSauces = (req, res, next) => {
    sauce.findOne({ _id: req.params.id }) // méthode findone pour renvoyer un tableau avec un seul objet (sauce) dans la base de données
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(404).json({ error }));
};


// Créer une sauce 
exports.createSauces = (req, res, next) => {
    const saucesObject = JSON.parse(req.body.sauce); // parser (parcourir en lisant) l'objet
    delete saucesObject._id; // Supprime l'ID fournit par le front car MongoDB crée le sien automatiquement 
    delete saucesObject._userId; // Supprime le userID fournit par le front 
    const saucesCree = new sauce({
       ...saucesObject, // création de la sauce moins les objets supprimés
       userId: req.auth.userId, // extraction de l'userid de l'objet requete grace au middleware
       likes: 0,
       dislikes: 0,
       usersLiked: [],
       usersDisliked: [],
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //url complète de l'image 
    });
 
   saucesCree.save() // enregistrement de l'objet
   .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})})
   .catch(error => { res.status(400).json( { error })})
};

// Modifier une sauce spécifique
exports.modifySauces = (req, res, next) => {
    const sauceObject = req.file ? { //vérifier si il un a un champ file dans notre objet requete
        ...JSON.parse(req.body.sauce), //on récupère l'objet en parsant la chaine de caractère
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // et on recréant l'url de l'image
    } : {...req.body }; //si non on récupère l'objet directement dans le corps de la requete

    sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // methode updateOne pour modifier l'objet(sauce)
          .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
          .catch(error => res.status(400).json({ error }));
    
};

// Suprimer une sauce spécifique
exports.deleteSauces = (req, res, next) => {
        sauce.deleteOne({ _id: req.params.id }) // methode deleteOne pour supprimer un objet dans la base de données
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
    
};


// Ajout ou suppression d'un like ou dislike
exports.createLikeSauces = (req, res, next) => {
    const like = req.body.like; // on récupère le like dans le corps de la requête
    const userId = req.body.userId; // on récupère le userId dans le corps de la requête
    const sauceId = req.params.id; // on récupère l'id (de la sauce) dans les paramètre de la requête

    switch (like) {
        case 1 : //si like = 1
          sauce.updateOne( // on met à jour la sauce
            {_id: sauceId}, // avec son Id
            {$inc: {likes: +1}, $push: {usersLiked: userId}}) // on ajoute 1 à likes et on ajoute l'id de l'utilisateur dans le tableau usersliked
            .then(() => res.status(200).json({ message: 'Like Ajouté !'}))
            .catch(error => res.status(400).json({ error }));
        break;

        case -1 : //si like = -1 (dislike)
          sauce.updateOne( // on met à jour la sauce
            {_id: sauceId}, // avec son id 
            {$inc: {dislikes: +1}, $push: {usersDisliked: userId}}) // on ajoute -1 à likes et on ajoute l'id de l'utilisateur au tableau usersdisliked
            .then(() => res.status(200).json({ message: 'Dislike Ajouté !'}))
            .catch(error => res.status(400).json({ error }));
        break;

        case 0 : // si on enlève un like ou disliked
          sauce.findOne({_id : sauceId}) // on récupère l'id de la sauce 
          .then(sauceLike =>{
            if(sauceLike.usersLiked.includes(userId)){ //si le tableau userliked récupèré détient le userId 
              sauce.updateOne( // on met à jour la sauce
                {_id: sauceId}, // avec son Id
                {$inc: {likes: -1}, $pull: {usersLiked: userId}}) // on retire 1 à likes et on retire l'id de l'utilisateur dans le tableau usersliked
                .then(() => res.status(200).json({ message: 'Like Supprimé !'}))
                .catch(error => res.status(400).json({ error }));
            }
            else if (sauceLike.usersDisliked.includes(userId)){ //si le tableau userdisliked récupèré détient le userId 
              sauce.updateOne( // on met à jour la sauce
                {_id: sauceId}, // avec son Id
                {$inc: {dislikes: -1}, $pull: {usersDisliked: userId}}) // on retire 1 à dislikes et on retire l'id de l'utilisateur dans le tableau usersdisliked
                .then(() => res.status(200).json({ message: 'Dislike Supprimé !'}))
                .catch(error => res.status(400).json({ error }));
            }
          })
        break;

        default : 
          console.log(error);

    }




}