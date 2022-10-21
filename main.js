const containerNode = document.querySelector("#fifteen");
const itemNodes = Array.from(containerNode.querySelectorAll(".item"));
const countItems = 16;
const inp = document.querySelector(".check");
console.log(inp);
let counter = document.querySelector(".count");
counter.innerHTML = 0;

let timer = document.querySelector(".timer");
timer.innerHTML = 0;

let interval = null;
let seconds = -1;

//! Audio for Click

console.log(inp.checked)

const audio = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
function isChecked () {
    if (inp.checked == true) {
        itemNodes.forEach((button) => {
            button.addEventListener("click", () => {
              audio.play();
            });
          });}
        
      
      else { return}
}



if (itemNodes.length !== 16) {
  throw new Error(`Должно быть не менее ${countItems} в HTML`);
}
itemNodes[countItems - 1].style.display = "none";

let matrix = getMatrix(
  itemNodes.map((item) => parseInt(item.dataset.matrixId))
);
setPositionItems(matrix);

//! shuffleButton
const shuffleButton = document.getElementById("shuffle");
shuffleButton.addEventListener("click", () => {
  const shuffledArray = shuffleArray(matrix.flat());
  matrix = getMatrix(shuffledArray);
  setPositionItems(matrix);
  reset();
  counter.innerText = 0;
});

//! shuffleReload
window.addEventListener("load", () => {
  const shuffledArrayLoad = shuffleArray(matrix.flat());
  matrix = getMatrix(shuffledArrayLoad);
  setPositionItems(matrix);
});

containerNode.addEventListener("click", (e) => {
  const blankNumber = 16;
  const buttonNode = e.target.closest("button");
  if (!buttonNode) {
    return;
  }
  const buttonNumber = parseInt(buttonNode.dataset.matrixId);
  const buttonCoords = findCoordinationByNumber(buttonNumber, matrix);
  const blankCoords = findCoordinationByNumber(blankNumber, matrix);
  const isValid = isValidSwap(buttonCoords, blankCoords);

  if (isValid) {
    swap(blankCoords, buttonCoords, matrix);
  }
});

function getMatrix(arr) {
  const matrix = [[], [], [], []];
  let y = 0;
  let x = 0;

  for (let i = 0; i < arr.length; i++) {
    if (x >= 4) {
      y++;
      x = 0;
    }
    matrix[y][x] = arr[i];
    x++;
  }
  return matrix;
}

function setPositionItems(matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const value = matrix[y][x];
      const node = itemNodes[value - 1];
      setNodeStyles(node, x, y);
    }
  }
}

function setNodeStyles(node, x, y) {
  const shiftPS = 100;
  node.style.transform = `translate(${x * shiftPS}%,${y * shiftPS}%)`;
}

function shuffleArray(arr) {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function findCoordinationByNumber(number, matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (number == matrix[y][x]) {
        return { x, y };
      }
    }
  }
}

function isValidSwap(coords1, coords2) {
  const diffX = Math.abs(coords1.x - coords2.x);
  const diffY = Math.abs(coords1.y - coords2.y);
  if (
    (diffX == 1 || diffY == 1) &&
    (coords1.x == coords2.x || coords1.y == coords2.y)
  ) {
    return true;
  } else {
    return false;
  }
}

function swap(coords1, coords2, matrix) {
  const coord1Number = matrix[coords1.y][coords1.x];
  matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x];
  matrix[coords2.y][coords2.x] = coord1Number;
  setPositionItems(matrix);

  const updateCounter = () => {
    let c = +counter.innerText;
    counter.innerText = c + 1;
    return counter.innerText;
  };
  startTimer();
  updateCounter();
}

const updateTimer = () => {
  seconds++;
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;

  if (secs < 10) secs = "0" + secs;
  if (mins < 10) mins = "0" + mins;

  timer.innerText = `${mins}:${secs}`;
};
updateTimer();

function startTimer() {
  if (interval) {
    return;
  }

  interval = setInterval(updateTimer, 1000);
}

function stop() {
  clearInterval(interval);
  interval = null;
}

function reset() {
  stop();
  seconds = -1;
  timer.innerText = "00:00";
}
