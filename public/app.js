
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
