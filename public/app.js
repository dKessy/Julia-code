
// Fonction pour exécuter les exercices
function runExercise(id) {
    const inputElement = document.getElementById(`${id}-input`);
    const outputElement = document.getElementById(`${id}-output`);
    const code = inputElement.value;

    fetch('/run-julia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code })
    })
    .then(response => response.json())
    .then(data => {
        outputElement.textContent = data.output;
    })
    .catch(error => {
        outputElement.textContent = 'Erreur : ' + error.message;
    });
}

/*const barCanvas = document.getElementById("barCanvas");

const barChart = new Chart(barCanvas, {
    type: "radar",
    data: {
        labels: ["Variable", "Operateur_exp", "Condit°_boucle", "Fonction"],
        datasets: [{
            data: [25, 35, 25, 40],
            backgroundColor: "rgba(1, 254, 135, 0.2)", // Couleur avec transparence
            borderColor: "#01fe87", // Couleur de la bordure
            borderWidth: 3, // Épaisseur de la bordure
            pointBackgroundColor: "#01fe87", // Points du radar
            pointBorderColor: "#01fe87"
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, // Permet de personnaliser la taille
        elements: {
            line: {
                tension: 0.3 // Lisser les lignes (facultatif)
            }
        },
        plugins: {
            legend: {
                display: false // Désactive la légende si inutile
            }
        },
        scales: {
            r: { // Axe radial (adapté pour un radar)
                suggestedMax: 100,
                ticks: {
                    font: {
                        size: 16 // Taille des chiffres
                    },
                    stepSize: 20, // Intervalle des graduations
                    color: "#000" // Couleur des chiffres
                },
                pointLabels: {
                    font: {
                        size: 18 // Taille des étiquettes
                    },
                    color: "#000" // Couleur des étiquettes
                },
                grid: {
                    color: "#ddd" // Couleur des lignes du quadrillage
                },
                angleLines: {
                    color: "#aaa" // Couleur des lignes radiales
                }
            }
        }
    }
});*/

// Fonction pour récupérer les points de l'utilisateur
//function getUserPoints(email) {
//    fetch(`/points?email=${encodeURIComponent(email)}`)
//        .then((response) => response.json())
//        .then((data) => {
//            console.log('Points de l’utilisateur:', data);
//            updatePointsDisplay(data);
//        })
//        .catch((error) => {
//            console.error('Erreur lors de la récupération des points:', error);
 //       });
//}

// Fonction pour mettre à jour les points d'un sujet
function updateUserPoints(email, subject, points) {
    fetch('/update-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, points }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Points mis à jour:', data);
            updatePointsDisplay(data);
        })
        .catch((error) => {
            console.error('Erreur lors de la mise à jour des points:', error);
        });
}

// Fonction pour afficher les points sur l'interface utilisateur
function updatePointsDisplay(points) {
    document.getElementById('points-variable').textContent = points.variable;
    document.getElementById('points-operator').textContent = points.operator;
    document.getElementById('points-condition').textContent = points.condition;
    document.getElementById('points-function').textContent = points.function;
}

