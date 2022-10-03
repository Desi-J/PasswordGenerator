// SYNC RANGE SLIDER TO NUMBER
const sliderElement = document.getElementById("slider");
const numberElement = document.getElementById("length");

sliderElement.addEventListener("input", handleInput);

function handleInput(e) {
  syncNumbers();
  updateProgressBar(e);
}
function syncNumbers() {
  const characterCount = sliderElement.value;
  numberElement.innerText = String(characterCount);
}

//SLIDER PROGRESS COLOR
const sliderProgressBar = document.querySelector("#sliderProgress");

function updateProgressBar(e) {
  const slider = e.target;
  //percentage
  const distance = slider.max - slider.min;
  const width = (100 / distance) * (slider.value - slider.min);
  sliderProgressBar.style.width = width + "%";
}

//COPY TO CLIPBOARD
const passwordText = document.getElementById("password-text");
const copyIcon = document.getElementById("copy-icon");
const copyTextConfirm = document.querySelector(".copy-text");

copyIcon.addEventListener("click", copyToClipboard);

function copyToClipboard() {
  let copyContent = passwordText.value;
  navigator.clipboard
    .writeText(copyContent)

    .then(copyTextConfirm.classList.remove("hidden"));
  setTimeout(() => {
    copyTextConfirm.classList.add("hidden");
  }, 4000);
}

//CUSTOM CHECKMARK STYLE
const checkboxElements = Array.from(
  document.querySelectorAll("input[type='checkbox']")
);

checkboxElements.forEach((element) => {
  if (element.id === "lowercase") {
    element.checked = true;
  } else {
    element.checked = false;
  }
  element.addEventListener("click", handleCheck);
});

function handleCheck(e) {
  const el = e.target;
  const parentLabel = el.parentElement;
  const customCheckbox = parentLabel.querySelector("span");
  customCheckbox.classList.toggle("checked");
}

//CHECK USER INPUT
passwordText.addEventListener("input", checkUserInput);

function checkUserInput(e) {
  const points = checkPassword(e.target.value);
  const styleData = calculatePoints(points);
  applyColor(styleData);
}

//GENERATE BUTTON
const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  generatePassword(checkboxElements, sliderElement.value);
}

//CHARACTER OBJECT
const characterObject = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*-_?"
};

//GENERATE PASSWORD
function generatePassword(checkboxArray, sliderValue) {
  const checkedValues = checkboxArray.reduce((acc, item) => {
    if (item.checked === true) acc = [...acc, item.id];
    return acc;
  }, []);

  if (checkedValues.length === 0) {
    alert("You must check at least one checkbox");
    return;
  }

  const possibleCharacters = genaratePossibleCharacters(checkedValues);

  let password = [];
  for (let i = 0; i < sliderValue; i++) {
    const randomCharacter = possibleCharacters.charAt(
      Math.floor(Math.random() * possibleCharacters.length)
    );
    password.push(randomCharacter);
  }

  passwordText.value = password.join("");

  const points = checkPassword();
  const styleData = calculatePoints(points);
  applyColor(styleData);
}

//CHECK PASSWORD
const lowercaseRegex = /([a-z])/;
const uppercaseRegex = /([A-Z])/;
const numberRegex = /\d/;
const symbolRegex = /\W/;

const mediumLength = 8;
const longLength = 12;

function checkPassword() {
  //check length
  const password = passwordText.value;
  let points = 0;

  const length = passwordText.value.length;
  if (length >= mediumLength && length < longLength) {
    points++;
  }
  if (length >= longLength) {
    points += 2;
  }

  //check characters
  const regexArray = [lowercaseRegex, uppercaseRegex, numberRegex, symbolRegex];

  regexArray.forEach((regex) => {
    if (password.match(regex)) {
      points++;
    }
  });

  return points;
}

//CALCULATE POINTS
const strengthText = document.getElementById("strength-text");

function calculatePoints(points) {
  let color;
  let count;

  switch (points) {
    case 6:
    case 5:
      strengthText.innerText = "Strong";
      color = "primary";
      count = 4;
      break;
    case 4:
      strengthText.innerText = "Medium";
      color = "caution";
      count = 3;
      break;
    case 3:
    case 2:
      strengthText.innerText = "Weak";
      color = "warning";
      count = 2;
      break;
    case 1:
      strengthText.innerText = "Too Weak!";
      color = "danger";
      count = 1;
      break;
    case 0:
      strengthText.innerText = "N/A";
      color = "blank";
      count = 0;
      break;
    default:
      return;
  }
  return [color, count];
}

//SET COLOR
const barElements = document.querySelectorAll(".bar");

function applyColor(styleData) {
  const [color, count] = styleData;

  barElements.forEach((element, index) => {
    element.className = "bar";

    if (index > count - 1) return;

    element.className = `bar fill-${color}`;
  });
}

//GENERATE USABLE CHARACTERS
function genaratePossibleCharacters(categories) {
  return categories
    .map((category) => {
      let string = "";
      return string.concat(characterObject[category]);
    })
    .join("");
}
