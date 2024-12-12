const express = require('express');
const session = require('express-session');
const app = require('./script'); // Import du fichier script.js

const port = 3000;



app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
