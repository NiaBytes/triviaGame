import { select, confirm } from '@inquirer/prompts';

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

async function runGame() {
  console.clear();
  console.log("Welcome to the JavaScript Developer Trivia Game!");
  console.log("\nGet ready!");
  
  for (let i = 3; i > 0; i--) {
    console.log(i + "...");
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  let score = 0;
  let missedQuestions = [];
  let totalTime = 0;

  for (let i = 0; i < triviaQuestions.length; i++) {
    console.clear();
    let currentQ = triviaQuestions[i];

    console.log("--- Question " + (i + 1) + " of " + triviaQuestions.length + " ---");
    console.log("You have 10 seconds to answer!\n");

    let choicesArray = [];
    for (let j = 0; j < currentQ.choices.length; j++) {
      choicesArray.push({
        name: currentQ.choices[j],
        value: currentQ.choices[j]
      });
    }

    let start = Date.now();

    let answer = await select({
      message: currentQ.question,
      choices: choicesArray
    });

    let end = Date.now();
    
    console.clear(); 

    let timeTaken = end - start;
    totalTime += timeTaken;

    console.log("--- Question " + (i + 1) + " of " + triviaQuestions.length + " ---");
    console.log("Your answer: " + answer + "\n");

    if (timeTaken > 10000) {
      console.log("Time's up! You took longer than 10 seconds.");
      missedQuestions.push(currentQ.question + " (Timeout)");
    } else if (answer === currentQ.correctAnswer) {
      console.log("Correct!");
      score += 10;
    } else {
      console.log("Incorrect! The correct answer was: " + currentQ.correctAnswer);
      missedQuestions.push(currentQ.question + " (Wrong Answer)");
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.clear();
  console.log("------------------------------");
  console.log("          GAME OVER");
  console.log("------------------------------");
  
  let maxScore = triviaQuestions.length * 10;
  console.log("Final Score: " + score + " / " + maxScore);
  console.log("Total Play Time: " + (totalTime / 1000) + " seconds");

  if (missedQuestions.length > 0) {
    console.log("\nHere is what you missed:");
    missedQuestions.forEach(function(q) {
      console.log("- " + q);
    });
  } else {
    console.log("\nPerfect score! You are a JavaScript master!");
  }

  console.log();
  let playAgain = await confirm({ 
    message: "Would you like to play again?"
  });

  if (playAgain) {
    runGame(); 
  } else {
    console.log("Thanks for playing! Goodbye.");
    process.exit(0);
  }
}

runGame();