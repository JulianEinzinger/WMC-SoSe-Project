let currentStep = 0; // Die aktuelle Frage im Quiz
const answers = [];  // Die Antworten des Nutzers

const app = document.getElementById("app");

// Antworten-Array mit null-Werten füllen
for (let i = 0; i < quiz.length; i++) {
    answers.push(null);
}

// Zeigt die aktuelle Frage und Antwortmöglichkeiten an
function renderQuestion() {
    const currentQuestion = quiz[currentStep];

    let html = `<div class="question">${currentStep + 1}. ${currentQuestion.question}</div>`;
    html += `<div class="options">`;

    for (let i = 0; i < currentQuestion.options.length; i++) {
        html += `
            <button class="option-button" onclick="selectAnswer(${i})">
                ${currentQuestion.options[i]}
            </button>
        `;
    }

    html += `</div>`;

    html += `
        <div class="nav-buttons">
            <button onclick="prev()" ${currentStep === 0 ? "disabled" : ""}>⬅ Back</button>
            <button onclick="next()">Next ➡</button>
        </div>
    `;

    app.innerHTML = html;
}

// Speichert die gewählte Antwort und geht zur nächsten Frage oder zeigt Ergebnisse
function selectAnswer(index) {
    answers[currentStep] = index;

    if (currentStep < quiz.length - 1) {
        currentStep++;
        renderQuestion();
    } else {
        showResults();
    }
}

// Geht eine Frage zurück
function prev() {
    if (currentStep > 0) {
        currentStep--;
        renderQuestion();
    }
}

// Geht zur nächsten Frage oder zeigt Ergebnisse
function next() {
    if (currentStep < quiz.length - 1) {
        currentStep++;
        renderQuestion();
    } else {
        showResults();
    }
}

// Zeigt die Auswertung der gegebenen Antworten
function showResults() {
    let html = `<div class="results"><h2>Your Results</h2>`;

    for (let i = 0; i < quiz.length; i++) {
        const q = quiz[i];
        const userAnswer = answers[i];
        const isCorrect = userAnswer === q.answer;

        html += `<div class="result-item">`;
        html += `<div><strong>Q${i + 1}:</strong> ${q.question}</div>`;
        html += `<div class="${isCorrect ? "correct" : "incorrect"}">Your answer: ${
            q.options[userAnswer] || "No answer"
        } ${isCorrect ? "✔" : "✘"}</div>`;

        if (!isCorrect) {
            html += `<div>Correct answer: ${q.options[q.answer]}</div>`;
        }

        html += `</div>`;
    }

    html += `<button onclick="restart()">Try Again</button></div>`;
    app.innerHTML = html;
}

// Setzt das Quiz zurück und startet es neu
function restart() {
    currentStep = 0;

    for (let i = 0; i < answers.length; i++) {
        answers[i] = null;
    }

    renderQuestion();
}

// Startet das Quiz beim Laden
renderQuestion();
