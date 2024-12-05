
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

const barCanvas = document.getElementById("barCanvas");

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
});
