const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
const session = require('express-session');

app.use(session({
    secret: 'blalalalalalalala', // clé sécurisée
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Utilise secure: true si HTTPS est activé
}));

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

app.get('/', (req, res) => {
    const isLoggedIn = req.session.user ? true : false;

    fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Erreur lors du chargement de la page.');
        }

        
        const userContent = isLoggedIn
            ? `
                <div class="user-info">
                    <img src="${req.session.user.avatar}" alt="Avatar" class="user-avatar">
                    <span>Bienvenue, ${req.session.user.name}</span>
                    <a href="/logout"><button>Déconnexion</button></a>
                </div>
            `
            : `
                <div class="connexion">
                    <button>Créer Compte</button>
                    <a href="/login"><button>Connexion</button></a>
                </div>
            `;

        
        const updatedPage = data.replace('{{userContent}}', userContent);
        res.send(updatedPage);
    });
});


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.post('/login', (req, res) => {
    const { email, password } = req.body;

   
    if (email === "test@example.com" && password === "password123") {
        req.session.user = {
            email: email,
            name: "Utilisateur Test",
            avatar: "https://via.placeholder.com/50" 
        };
        res.redirect('/');
    } else {
        res.status(401).send('Identifiants invalides');
    }
});
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Erreur lors de la déconnexion.");
        }
        res.redirect('/');
    });
});



app.get('/type_variable', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'variable.html'));
});

app.get('/operateur_expression', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'op_expr.html'));
});

app.get('/condition_boucle', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'condi_bouc.html'));
});

app.get('/fonction', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'fonct.html'));
});
app.use(express.static('public'));

app.post('/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    
    console.log('Nouvelle inscription :', { email, password });

    // Réponse au client
    res.send(`
        <h1>Inscription réussie</h1>
        <p>Votre adresse e-mail : ${email}</p>
        <p>Votre mot de passe (non sécurisé !) : ${password}</p>
        <a href="/">Retour à l'accueil</a>
    `);
});


app.post('/run-julia', (req, res) => {
    const codeJulia = req.body.code;

    
    const filePath = path.join(__dirname, 'temp_code.jl');
    
    fs.writeFile(filePath, codeJulia, (err) => {
        if (err) {
            console.error('Erreur lors de la création du fichier:', err);
            return res.status(500).send({ output: 'Erreur de fichier' });
        }

        
        exec(`julia ${filePath}`, (error, stdout, stderr) => {
            
            fs.unlink(filePath, (err) => {
                if (err) console.error('Erreur lors de la suppression du fichier:', err);
            });

            if (error) {
                console.error(`Erreur d'exécution: ${error.message}`);
                return res.status(500).send({ output: error.message });
            }
            if (stderr) {
                console.error(`Erreur Julia: ${stderr}`);
                return res.status(500).send({ output: stderr });
            }

            
            res.send({ output: stdout });
        });
    });
});


app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
