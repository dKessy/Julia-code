const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

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
