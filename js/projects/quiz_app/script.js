const questions = [
    {
        question: "What is 2 + 2?",
        choices: ["3", "4", "5"],
        answer: "4"
    },
    {
        question: "What is the capital of France?",
        choices: ["London", "Berlin", "Paris"],
        answer: "Paris"
    },
    {
        question: "Which language runs in a web browser?",
        choices: ["Python", "JavaScript", "C++"],
        answer: "JavaScript"
    }
];

let currentQuestionIndex = 0;
let score = 0;

const questionEl = document.querySelector("#question");
const choicesEl = document.querySelector("#choices");
const scoreEl = document.querySelector("#score");

function loadQuestion() {
    const current = questions[currentQuestionIndex];
    questionEl.innerHTML = current.question;
    choicesEl.innerHTML = "";

    current.choices.forEach(function (choice) {
        const button = document.createElement("button");
        button.textContent = choice;
        button.className = "choice-btn";
        button.addEventListener("click", function () {
            if (button.textContent === current.answer) {
                score++;
            }
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                loadQuestion();
            } else {
                questionEl.style.display = "none";
                choicesEl.style.display = "none";
                scoreEl.style.display = "block";
                scoreEl.innerHTML = "Final Score: " + score + " / " + questions.length;
            }
        });
        choicesEl.appendChild(button);
    });
}

loadQuestion();
