const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


module.exports = app;
const session = require('express-session');

app.use(session({
    secret: 'votre_secret', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));



//const users = {
//    "test@example.com": {
 //       password: "motdepasse123",
 //       points: { variable: 0, operator: 0, condition: 0, function: 0 },
//    },
//};"


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
                    <span>Bienvenue, ${req.session.user.nom}</span>
                    <a href="/logout"><button>Déconnexion</button></a>
                </div>
            `
            : `
                <div class="connexion">
                    <a href="/sign"><button>Créer Compte</a></button>
                    <a href="/login"><button>Connexion</a></button>
                </div>
            `;

        const userGraphContent = isLoggedIn
        ? `
            <div class="conteneur_radar">
                <canvas id="barCanvas" aria-label="chart" role="img"></canvas>
            </div>
            <div class="section_point">
                <h2>Système de points</h2>
                <p>Variable: <span id="points-variable">0</span></p>
                <p>Opérateur et expression: <span id="points-operator">0</span></p>
                <p>Condition et boucle: <span id="points-condition">0</span></p>
                <p>Fonction: <span id="points-function">0</span></p>
                
                <button onclick="updateUserPoints('${req.session.user.email}', 'variable', 10)">+10 Points Variable</button>
                <button onclick="updateUserPoints('${req.session.user.email}', 'operator', 10)">+10 Points Opérateur</button>
                <button onclick="updateUserPoints('${req.session.user.email}', 'condition', 10)">+10 Points Condition</button>
                <button onclick="updateUserPoints('${req.session.user.email}', 'function', 10)">+10 Points Fonction</button>
            </div>
        `
        : '';

        const updatedPage = data
            .replace('{{userContent}}', userContent)
            .replace('{{userGraphContent}}', userGraphContent);
        

        res.send(updatedPage);
    });
});

app.use(express.static('public'));


app.get('/points', (req, res) => {
    const email = req.query.email;
    if (users[email]) {
        res.send(users[email].points);
    } else {
        res.status(404).send('Utilisateur non trouvé.');
    }
});

app.post('/update-points', (req, res) => {
    const { email, subject, points } = req.body;
    if (users[email]) {
        users[email].points[subject] += points;
        res.send(users[email].points);
    } else {
        res.status(404).send('Utilisateur non trouvé.');
    }
});


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return res.status(500).send('Erreur serveur.');
        }

        const users = JSON.parse(data);

        const utilisateur = users.find(user => user.email === email && user.password === password);

        if (utilisateur) {
        
            req.session.user = utilisateur;

            console.log("Utilisateur authentifié :", req.session.user);
            console.log('Connexion réussie.');
            res.redirect('/');
            
        } else {
        
            return res.status(401).send('Email ou nom incorrect.');
        }
    });
});


app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send("Erreur lors de la déconnexion.");
        res.redirect('/');
    });
});

app.get('/sign', (req, res) => {
    fs.readFile(path.join(__dirname, 'public', 'sign.html'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Erreur lors du chargement de la page d\'inscription.');
        }
        res.send(data);
    });
});
app.post('/sign', (req, res) => {
    const { email, password,  nom } = req.body;
    
    if (!email || !password || !nom) {
        return res.status(400).send('Tous les champs doivent être remplis.');
    }

    const fichier = 'users.json';

    
    fs.readFile(fichier, 'utf8', (err, data) => {
        let users = [];

        if (!err && data.trim().length > 0) {
            users = JSON.parse(data);
        } else if (err && err.code !== 'ENOENT') {
            console.error("Erreur lors de la lecture du fichier JSON :", err);
            return res.status(500).send('Erreur serveur.');
        }

        const utilisateurExistant = users.find(user => user.email === email);
        if (utilisateurExistant) {
            return res.status(409).send('Un utilisateur avec cet email existe déjà.');
        }

        const nouvelUtilisateur = {
            id: users.length + 1,
            email: email,
            password: password,
            avatar: "https://via.placeholder.com/50",
            nom: nom
        };
        users.push(nouvelUtilisateur);

        fs.writeFile(fichier, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error("Erreur lors de la sauvegarde du fichier JSON :", err);
                r
                return res.status(500).send('Erreur lors de l\'enregistrement.');
            }

            console.log("Nouvel utilisateur enregistré :", nouvelUtilisateur);
            res.redirect('/login');
        });
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


app.post('/run-julia', (req, res) => {
    const codeJulia = req.body.code;
    const filePath = path.join(__dirname, 'temp_code.jl');

    fs.writeFile(filePath, codeJulia, (err) => {
        if (err) return res.status(500).send({ output: 'Erreur de fichier' });

        exec(`julia ${filePath}`, (error, stdout, stderr) => {
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) console.error('Erreur lors de la suppression du fichier:', unlinkErr);
            });

            if (error) return res.status(500).send({ output: error.message });
            if (stderr) return res.status(500).send({ output: stderr });

            res.send({ output: stdout });
        });
    });
});


module.exports = app;
