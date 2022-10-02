//Importation du package HTTP de NODE ("require" = commande pour importer le package de NODE )
const { prototype } = require('events');
const http = require('http');

//Importation de notre application "app"
const app = require('./app');

//la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };

//
const port = normalizePort(process.env.PORT || '3000');

//On doit dire à l'application express sur quel port elle doit tourner, on utlise la méthode "set"
app.set('port', port);

//la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
};

//Création du server avec la méthode "createServer" du package HTTP et cette méthode reçoit comme argument notre application
const server = http.createServer(app);

//
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

//Ecouter les requetes envoyées avec la méthode LISTEN du server sur le port 
server.listen(port);