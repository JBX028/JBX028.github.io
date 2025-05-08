let questions = [];
let current = 0;
let correctAnswers = 0;
let totalQuestions = 0;

const questionBox = document.getElementById('question-box');
const questionEl = document.getElementById('question');
const choicesList = document.getElementById('choices');
const explanationEl = document.getElementById('explanation');
const nextBtn = document.getElementById('next-btn');
const startBtn = document.getElementById('start-btn');
const endBtn = document.getElementById('end-btn');
const scoreBox = document.getElementById('score');
const correctCountEl = document.getElementById('correct-count');

const timerBox = document.getElementById('timer');
const timeEl = document.getElementById('time');
let timerInterval;
let secondsElapsed = 0;

startBtn.addEventListener('click', startSession);
endBtn.addEventListener('click', endSession);
nextBtn.addEventListener('click', () => {
  current++;
  if (current >= questions.length) {
    alert("Quiz complete!");
    endSession();
  } else {
    showQuestion();
  }
});

// Ensure buttons and dynamic elements adjust for responsiveness
window.addEventListener('resize', () => {
    const container = document.querySelector('.container');
    if (window.innerWidth < 768) {
      container.style.padding = '10px';
    } else {
      container.style.padding = '20px';
    }
  });
  
  // Example: Adjust font size dynamically for smaller screens
  function adjustFontSize() {
    const h1 = document.querySelector('h1');
    if (window.innerWidth < 768) {
      h1.style.fontSize = '1.5rem';
    } else {
      h1.style.fontSize = '2rem';
    }
  }
  
  window.addEventListener('resize', adjustFontSize);
  adjustFontSize();
  
function startSession() {
    fetch('questions.json')
      .then(res => res.json())
      .then(data => {
        questions = shuffle([...data]);
        current = 0;
        correctAnswers = 0;
        secondsElapsed = 0;
        correctCountEl.textContent = correctAnswers;
  
        questionBox.classList.remove('hidden');
        endBtn.classList.remove('hidden');
        startBtn.classList.add('hidden');
        scoreBox.classList.remove('hidden');
        timerBox.classList.remove('hidden');
  
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
  
        showQuestion();
      });
  }

  function endSession() {
    totalQuestions = 0;
    document.getElementById('total-questions').textContent = totalQuestions;
    questions = [];
    current = 0;
  
    clearInterval(timerInterval);
    timeEl.textContent = '00:00';
  
    questionBox.classList.add('hidden');
    explanationEl.classList.add('hidden');
    nextBtn.classList.add('hidden');
    endBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    scoreBox.classList.add('hidden');
    timerBox.classList.add('hidden');
    correctCountEl.textContent = '0';
  }

  function updateTimer() {
    secondsElapsed++;
    const minutes = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
    const seconds = String(secondsElapsed % 60).padStart(2, '0');
    timeEl.textContent = `${minutes}:${seconds}`;
  }
  

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function showQuestion() {
    totalQuestions++;
    document.getElementById('total-questions').textContent = totalQuestions;
    explanationEl.classList.add('hidden');
    nextBtn.classList.add('hidden');
  
    const question = questions[current];
    questionEl.textContent = `${question.id}. ${question.question}`;
    choicesList.innerHTML = '';
  
    question.choices.forEach(choice => {
      const li = document.createElement('li');
      li.textContent = choice;
      li.addEventListener('click', () => handleAnswer(li, question.answer));
      choicesList.appendChild(li);
    });
  }

// filepath: /Users/johnnybaillargeaux/Documents/node/JBX028.github.io/script.js
function handleAnswer(selectedLi, correctAnswer) {
  const selectedLetter = selectedLi.textContent.trim().charAt(0);
  const allChoices = document.querySelectorAll('#choices li');

  allChoices.forEach(li => {
      li.style.pointerEvents = 'none';
      const letter = li.textContent.trim().charAt(0);
      if (letter === correctAnswer) {
          li.classList.add('correct');
      } else if (li === selectedLi) {
          li.classList.add('incorrect');

          // Force repaint for mobile browsers
          li.style.display = 'none';
          li.offsetHeight; // Trigger reflow
          li.style.display = 'block';
      }
  });

  if (selectedLetter === correctAnswer) {
      correctAnswers++;
      correctCountEl.textContent = correctAnswers;
  }

  explanationEl.textContent = questions[current].explanation || '';
  explanationEl.classList.remove('hidden');
  nextBtn.classList.remove('hidden');
}
