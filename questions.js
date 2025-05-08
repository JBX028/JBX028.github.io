const fs = require('fs');
const pdf = require('pdf-parse');

const fileBuffer = fs.readFileSync('Salesforce+Agentforce+Specialist.pdf');

pdf(fileBuffer).then(data => {
  const text = data.text;
  const pages = text.split('\n');

  const questions = [];
  let i = 0;
  let currentQuestion = null;

  while (i < pages.length) {
    const line = pages[i].trim();

    // Detect start of question
    const questionMatch = line.match(/^(\d+)\.(.+)/);
    if (questionMatch) {
      if (currentQuestion) questions.push(currentQuestion);

      currentQuestion = {
        id: questionMatch[1],
        question: questionMatch[2].trim(),
        choices: [],
        answer: '',
        explanation: ''
      };

      i++;

      // Collect question text (multi-line)
      while (i < pages.length && !pages[i].trim().startsWith('A.')) {
        currentQuestion.question += ' ' + pages[i].trim();
        i++;
      }

      // Collect choices A, B, C
      const choiceLabels = ['A.', 'B.', 'C.'];
      for (let c = 0; c < 3 && i < pages.length; c++) {
        let choiceLine = pages[i].trim();
        if (!choiceLine.startsWith(choiceLabels[c])) break;

        let fullChoice = choiceLine;
        i++;

        // Append any continuation lines until next label or special marker
        while (
          i < pages.length &&
          !choiceLabels.includes(pages[i].trim().slice(0, 2)) &&
          !pages[i].trim().startsWith('Answer:') &&
          !pages[i].trim().match(/^\d+\./)
        ) {
          fullChoice += ' ' + pages[i].trim();
          i++;
        }

        currentQuestion.choices.push(fullChoice);
      }

      // Look for Answer
      while (i < pages.length && !pages[i].trim().startsWith('Answer:')) i++;
      if (pages[i] && pages[i].trim().startsWith('Answer:')) {
        const answerLine = pages[i].trim();
        currentQuestion.answer = answerLine.replace('Answer:', '').trim().charAt(0);
        i++;
      }

      // Look for Explanation
      while (i < pages.length && !pages[i].trim().startsWith('Explanation:')) i++;
      if (pages[i] && pages[i].trim().startsWith('Explanation:')) {
        i++;
        let explanation = '';
        while (
          i < pages.length &&
          !pages[i].trim().match(/^\d+\./)
        ) {
          explanation += ' ' + pages[i].trim();
          i++;
        }
        currentQuestion.explanation = explanation.trim();
      }
    } else {
      i++;
    }
  }

  if (currentQuestion) questions.push(currentQuestion);

  fs.writeFileSync('questions.json', JSON.stringify(questions, null, 2));
  console.log(`Extracted ${questions.length} questions to questions.json`);
});
