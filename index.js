const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const triviaQuestions = [
  {
    question: "Which keyword is used to declare a block-scoped variable in JavaScript?",
    choices: ["var", "let", "constant", "assign"],
    correctAnswer: "let"
  },
  {
    question: "What does HTML stand for?",
    choices: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Tool Multi Language"],
    correctAnswer: "Hyper Text Markup Language"
  },
  {
    question: "Which of the following is an Array iteration method?",
    choices: ["Array.splice()", "Array.push()", "Array.map()", "Array.length"],
    correctAnswer: "Array.map()"
  },
  {
    question: "What is the output of 'typeof null' in JavaScript?",
    choices: ["null", "undefined", "object", "number"],
    correctAnswer: "object"
  },
  {
    question: "Which symbol is used for strict equality comparison?",
    choices: ["=", "==", "===", "!=="],
    correctAnswer: "==="
  }
];

async function startCountdown() {
  console.log("\nGet ready!");
  for (let i = 3; i > 0; i--) {
    console.log(`${i}...`);
    await delay(1000); 
  }
  console.log("Go!\n");
}

async function runGame() {
  const { select, confirm } = await import('@inquirer/prompts');

  // Define a plain text theme to block all default emojis
  const plainTheme = {
    prefix: '>', 
    icon: { cursor: '→' }
  };

  await startCountdown();

  const results = [];
  const TIME_LIMIT_MS = 10000; 
  let totalGameTime = 0;

  for (let i = 0; i < triviaQuestions.length; i++) {
    const currentQ = triviaQuestions[i];

    console.log(`\n--- Question ${i + 1} of ${triviaQuestions.length} ---`);
    console.log(`You have ${TIME_LIMIT_MS / 1000} seconds to answer!`);

    const startTime = Date.now();

    const formattedChoices = currentQ.choices.map(choice => ({
      name: choice,
      value: choice
    }));

    const answer = await select({
      message: currentQ.question,
      choices: formattedChoices,
      theme: plainTheme // Inject plain theme here
    });

    const endTime = Date.now();
    const timeTaken = endTime - startTime;
    totalGameTime += timeTaken;

    const isTimeUp = timeTaken > TIME_LIMIT_MS;
    const isCorrect = answer === currentQ.correctAnswer;

    if (isTimeUp) {
      console.log(`[TIMEOUT] Time's up! You took ${(timeTaken / 1000).toFixed(1)} seconds. (Limit is 10s)`);
      results.push({ question: currentQ.question, scored: false, reason: "Timeout" });
    } else if (isCorrect) {
      console.log("Correct!");
      results.push({ question: currentQ.question, scored: true, reason: "Correct" });
    } else {
      console.log(`X Incorrect! The correct answer was: "${currentQ.correctAnswer}"`);
      results.push({ question: currentQ.question, scored: false, reason: "Wrong Answer" });
    }
    
    await delay(1500); 
  }

  const finalScore = results.reduce((acc, curr) => {
    return curr.scored ? acc + 10 : acc; 
  }, 0);

  const missedQuestions = results.filter(result => result.scored === false);

  console.log("\n" + "=".repeat(30));
  console.log("        GAME OVER ");
  console.log("=".repeat(30));
  
  const maxScore = triviaQuestions.length * 10;
  console.log(`Final Score: ${finalScore} / ${maxScore}`);
  console.log(`Total Play Time: ${(totalGameTime / 1000).toFixed(1)} seconds`);

  if (missedQuestions.length > 0) {
    console.log("\nHere is what you missed or ran out of time on:");
    missedQuestions.forEach(q => console.log(`X ${q.question} (Reason: ${q.reason})`));
  } else {
    console.log("\nPerfect score! You are a JavaScript master!");
  }

  const playAgain = await confirm({ 
    message: "\nWould you like to play again?",
    theme: plainTheme 
  });
  
  if (playAgain) {
    console.clear();
    await runGame(); 
  } else {
    console.log("Thanks for playing! Goodbye.");
    process.exit(0);
  }
}

console.clear();
console.log("Welcome to the JavaScript Developer Trivia Game!");
runGame();