const loginPopup = document.getElementById("loginPopup");
const usernameInput = document.getElementById("username");
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");
const gameContainer = document.getElementById("gameContainer");
const playerNameSpan = document.getElementById("playerName");
const prompt = document.getElementById("prompt");
const scoreDisplay = document.getElementById("score");
const logoutButton = document.getElementById("logoutButton");
const landingPageButton = document.getElementById("landingPageButton");
const clearScoreButton = document.getElementById("clearScoreButton");

const regions = [
  { id: "constellation1", name: "Ursa Major" },
  { id: "constellation2", name: "Ursa Minor" },
  { id: "constellation3", name: "Draco" },
  { id: "constellation4", name: "Bootes" },
  { id: "constellation5", name: "Corona Borealis" },
  { id: "constellation6", name: "Coma Berenice" },
  { id: "constellation7", name: "Leo" },
  { id: "constellation8", name: "Cancer" },
  { id: "constellation9", name: "Cepheus" },
  { id: "constellation10", name: "Ophiuchus" },
  { id: "constellation11", name: "Preseus" },
  { id: "constellation12", name: "Aquarius" },
  { id: "constellation13", name: "Scorpio" },
  { id: "constellation14", name: "Canis Major" },
];

let currentPrompt = "";
let score = 0;

function updateScoreDisplay() {
  scoreDisplay.textContent = `Score: ${score}`;
  scoreDisplay.className = score >= 0 ? "positive" : "negative";
}

function startGame(username) {
  playerNameSpan.textContent = username;
  updateScoreDisplay();
  loginPopup.style.display = "none";
  gameContainer.style.display = "block";
  newPrompt();
}

function newPrompt() {
  const randomRegion = regions[Math.floor(Math.random() * regions.length)];
  currentPrompt = randomRegion.name;
  prompt.textContent = `Point to the constellation: ${currentPrompt}`;
}

regions.forEach((region) => {
  document.getElementById(region.id).addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent the event from bubbling up to the document
    const username = sessionStorage.getItem("currentUser");
    if (!username) {
      alert("Please log in to play the game.");
      return;
    }

    if (region.name === currentPrompt) {
      score++;
      alert("Correct!");
    } else {
      score--;
      alert("Wrong!");
    }

    localStorage.setItem(username, score);
    updateScoreDisplay();
    newPrompt();
  });
});

document.getElementById("constellationMap").addEventListener("click", (event) => {
  const username = sessionStorage.getItem("currentUser");
  if (!username) {
    return;
  }

  score--;
  alert("Wrong!");

  localStorage.setItem(username, score);
  updateScoreDisplay();
  newPrompt();
});

loginButton.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (username) {
    const savedScore = localStorage.getItem(username);
    if (savedScore !== null) {
      score = parseInt(savedScore, 10);
      sessionStorage.setItem("currentUser", username);
      startGame(username);
    } else {
      alert("User not found. Please register.");
    }
  } else {
    alert("Please enter a username!");
  }
});

registerButton.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (username) {
    if (localStorage.getItem(username) === null) {
      localStorage.setItem(username, 0);
      alert("User registered successfully! Please log in.");
    } else {
      alert("User already exists. Please log in.");
    }
  } else {
    alert("Please enter a username!");
  }
});

logoutButton.addEventListener("click", () => {
  sessionStorage.removeItem("currentUser");
  score = 0;
  gameContainer.style.display = "none";
  loginPopup.style.display = "flex";
  usernameInput.value = "";
});

landingPageButton.addEventListener("click", () => {
  window.location.href = "../landing.html";
});

clearScoreButton.addEventListener("click", () => {
  const username = sessionStorage.getItem("currentUser");
  if (username) {
    score = 0;
    localStorage.setItem(username, score);
    updateScoreDisplay();
    alert("Your score has been cleared!");
  } else {
    alert("No user logged in to clear the score.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = sessionStorage.getItem("currentUser");
  if (currentUser) {
    const savedScore = parseInt(localStorage.getItem(currentUser), 10) || 0;
    score = savedScore;
    startGame(currentUser);
  }
});
