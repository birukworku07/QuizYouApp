const startButton = document.querySelector(".start-btn");
const questionDiv = document.querySelector(".question");
const choiceA = document.querySelector("#choiceA");
const choiceB = document.querySelector("#choiceB");
const choiceC = document.querySelector("#choiceC");
const choiceD = document.querySelector("#choiceD");
const miniContainer = document.querySelector(".mini-container");
const questionStatment = document.querySelector("#statement");
const body = document.body;
const gameOverDiv = document.querySelector(".game-over");
const gameOverPar = document.querySelector(".game-over-par");
const restartButton = document.querySelector(".rstrt-btn");
const menuButton = document.querySelector(".mnu-btn");
const letsGoButton = document.querySelector(".submit-btn");
const menuPage = document.querySelector(".categories");
const selectingCategs = document.querySelector("#selectingCategs");
const noQuestions = document.querySelector("#noQuestions");
const difficulty = document.querySelector("#difficulty");
const maxChance = 2;
let scoreReport = null;
let category = "";
let numQuestions = "";
let level = "";
let result = null;
let i = null;
let counter = 0;
let currentChance = null;
let resultHeader = null;
let uniqueQuestions = [];
let score = 0;

function randomize() {
  return Math.floor(Math.random() * numQuestions);
}

function randomizeChoice() {
  return Math.floor(Math.random() * 4);
}

function generateQuestion() {
  //miniContainer.classList.remove("bfr-strt-btn-trigger");
  if (resultHeader) {
    resultHeader.remove();
  }

  body.style.backgroundColor = "#9c73da";
  currentChance = 0;

  //randomizing the questions
  i = randomize();

  while (counter < numQuestions) {
    if (uniqueQuestions.includes(i)) {
      i = randomize();
    } else {
      uniqueQuestions.push(i);
      console.log("THIS IS MY UNIQUE Q", i);
      ++counter;
      console.log(counter);
      break;
    }
  }
  console.log(result.data.results[i]);
  questionStatment.innerText = atob(result.data.results[i].question);
  let questionChoices = [
    ...result.data.results[i].incorrect_answers,
    result.data.results[i].correct_answer,
  ];

  //console.log("array is", questionChoices);

  //Randomizing the choices

  const uniqueRandomChoice = [-1, -1, -1, -1];
  const choiceObjects = [choiceA, choiceB, choiceC, choiceD];
  let choiceIndex = randomizeChoice();
  let index = 0;
  while (index < 4) {
    if (uniqueRandomChoice.includes(choiceIndex)) {
      choiceIndex = randomizeChoice();
    } else {
      uniqueRandomChoice.push(choiceIndex);
      choiceObjects[index].innerText = atob(questionChoices[choiceIndex]);
      ++index;
    }
  }
}

selectingCategs.addEventListener("change", (e) => {
  console.log(selectingCategs.value);
  category = selectingCategs.value;
});

noQuestions.addEventListener("change", (e) => {
  console.log(noQuestions.value);
  numQuestions = noQuestions.value;
});

difficulty.addEventListener("change", (e) => {
  console.log(difficulty.value);
  level = difficulty.value;
});

async function fetch() {
  let response = "";
  let endPoint = "";
  try {
    endPoint = `https://opentdb.com/api.php?amount=${numQuestions}&category=${category}&difficulty=${level}&type=multiple&encode=base64`;
    response = await axios.get(endPoint);
  } catch (e) {
    console.log("error while fetching", e);
  }

  return response;
}

function gameOver() {
  console.log("Game Over! YOU LOSE!");
  //last-state appearing
  if (scoreReport === null) {
    scoreReport = document.createElement("h1");
    scoreReport.classList.add("game-over-par");
  }

  scoreReport.innerText = `Your Score is: ${score}/${numQuestions}`;
  //scoreReport.classList.add("game-over-par");
  gameOverDiv.insertBefore(
    scoreReport,
    gameOverDiv.firstElementChild.nextSibling
  );
  gameOverDiv.classList.toggle("last-state");
  gameOverDiv.classList.toggle("game-over");
  //question and choice disappering
  miniContainer.classList.toggle("bfr-strt-btn-trigger");
  miniContainer.classList.toggle("question-choices");
  console.log("toggled question choices");
  resultHeader.remove();
  body.style.backgroundColor = "#9c73da";
}

function doneWithAll() {
  gameOverPar.innerText = "Congrats! You made it to the other side!";
  if (scoreReport === null) {
    scoreReport = document.createElement("h1");
    scoreReport.classList.add("game-over-par");
  }

  scoreReport.innerText = `Your Score is: ${score}/${numQuestions}`;

  gameOverDiv.insertBefore(
    scoreReport,
    gameOverDiv.firstElementChild.nextSibling
  );
  //last-state appearing
  gameOverDiv.classList.toggle("last-state");
  gameOverDiv.classList.toggle("game-over");
  //question and choice disappering
  miniContainer.classList.toggle("bfr-strt-btn-trigger");
  miniContainer.classList.toggle("question-choices");
  console.log("toggled question choices");
  resultHeader.remove();
  body.style.backgroundColor = "#9c73da";
}

function correct() {
  body.style.backgroundColor = "rgb(37, 130, 27)";

  if (!resultHeader) {
    resultHeader = document.createElement("h1");
    resultHeader.classList.add("result-labels");
  }

  resultHeader.innerText = "CORRECT!";
  body.insertBefore(resultHeader, body.firstChild);
  ++score;
}

function wrong() {
  body.style.backgroundColor = "rgb(180, 37, 27)";
  currentChance += 1;
  if (currentChance === maxChance) {
    gameOver();
  } else {
    if (!resultHeader) {
      resultHeader = document.createElement("h1");
      resultHeader.classList.add("result-labels");
    }

    let remainingChance = maxChance - currentChance;
    resultHeader.innerText = `WRONG! ${remainingChance} more trial left`;
    score -= 0.5;
    body.insertBefore(resultHeader, body.firstChild);
  }
}

function nextQuestion() {
  if (counter === parseInt(numQuestions)) {
    console.log("Counter and numquestions:", counter, numQuestions);
    /*TODO: Congragulations state showing the score
     *score reduces by 0.5 if you miss a question once
     */
    doneWithAll();
  } else {
    setTimeout(() => {
      generateQuestion();
    }, 1000);
  }
}

restartButton.addEventListener("click", (e) => {
  console.log("Restarted");
  // gameover state disappering
  gameOverDiv.classList.toggle("last-state");
  gameOverDiv.classList.toggle("game-over");
  //toggling the question and choice state
  miniContainer.classList.toggle("question-choices");
  miniContainer.classList.toggle("bfr-strt-btn-trigger");
  uniqueQuestions = [];
  counter = 0;
  score = 0;
  generateQuestion();
});

menuButton.addEventListener("click", (e) => {
  //disappering the last-state
  gameOverDiv.classList.toggle("last-state");
  gameOverDiv.classList.toggle("game-over");
  /* TODO: We want to go to the 2nd state(Menu state)
   */
  menuPage.classList.toggle("strt-btn-trigger");
  menuPage.classList.toggle("categoriesDisplay");
  uniqueQuestions = [];
  counter = 0;
  score = 0;
});

startButton.addEventListener("click", (e) => {
  console.log("Clicked");
  startButton.classList.toggle("strt-btn-trigger");
  menuPage.classList.toggle("strt-btn-trigger");
  menuPage.classList.toggle("categoriesDisplay");
});

letsGoButton.addEventListener("click", async (e) => {
  menuPage.classList.toggle("strt-btn-trigger");
  menuPage.classList.toggle("categoriesDisplay");
  miniContainer.classList.toggle("bfr-strt-btn-trigger");
  miniContainer.classList.toggle("question-choices");
  result = await fetch();
  console.log(result);
  generateQuestion();
});

choiceA.addEventListener("click", (e) => {
  if (choiceA.innerText === atob(result.data.results[i].correct_answer)) {
    console.log("CORRECT");
    correct();
    nextQuestion();
  } else {
    console.log("Incorrect");
    wrong();
  }
});

choiceB.addEventListener("click", (e) => {
  if (choiceB.innerText === atob(result.data.results[i].correct_answer)) {
    console.log("CORRECT");
    correct();
    nextQuestion();
  } else {
    console.log("Incorrect");
    wrong();
  }
});

choiceC.addEventListener("click", (e) => {
  if (choiceC.innerText === atob(result.data.results[i].correct_answer)) {
    console.log("CORRECT");
    correct();
    nextQuestion();
  } else {
    console.log("Incorrect");
    wrong();
  }
});

choiceD.addEventListener("click", (e) => {
  if (choiceD.innerText === atob(result.data.results[i].correct_answer)) {
    console.log("CORRECT");
    correct();
    nextQuestion();
  } else {
    console.log("Incorrect");
    wrong();
  }
});
