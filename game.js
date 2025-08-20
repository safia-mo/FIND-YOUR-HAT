const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

let myField;
let gameActive = false;
let currentLevel = 1;

function updateLevelDisplay() {
  document.getElementById("level-display").textContent = `Level: ${currentLevel}`;
}

const startBtn = document.getElementById("start-btn");
const playAgainBtn = document.getElementById("play-again-btn");

startBtn.onclick = () => {
  document.getElementById("rules-box").classList.add("hidden");
  currentLevel = 1;
  updateLevelDisplay();
  myField = new Field(Field.generateField(currentLevel), currentLevel);
  myField.print();
  gameActive = true;
  document.getElementById("message-overlay").classList.add("hidden");
};

playAgainBtn.onclick = () => {
  myField = new Field(Field.generateField(currentLevel), currentLevel);
  myField.print();
  gameActive = true;
  document.getElementById("message-overlay").classList.add("hidden");
};

class Field {
  constructor(field, level = 1) {
    this.field = field;
    this.playerRow = 0;
    this.playerCol = 0;
    this.level = level;
  }
  
print() {
  const board = document.getElementById("game-board");
  let columns = this.field[0].length;
  let rows = this.field.length;

  const cellWidth = board.clientWidth / columns;
  const cellHeight = board.clientHeight / rows;
  const fontSize = Math.min(cellWidth, cellHeight) * 0.6; // 60% of cell

  let html = `<div class="field-grid" style="display: grid; width:100%; height:100%; grid-template-columns: repeat(${columns}, 1fr); grid-template-rows: repeat(${rows}, 1fr);">`;

  for (let row of this.field) {
    for (let cell of row) {
      html += `<div class="field-cell" style="font-size:${fontSize}px; box-sizing:border-box;">${cell}</div>`;
    }
  }

  html += '</div>';
  board.innerHTML = html;
}

showMessage(message, showButton = true) {
    document.getElementById("message-text").textContent = message;
    document.getElementById("message-overlay").classList.remove("hidden");
    document.getElementById("play-again-btn").style.display = showButton ? "block" : "none";
}

move(direction) {
  if (direction === "up") this.playerRow--;
  if (direction === "down") this.playerRow++;
  if (direction === "left") this.playerCol--;
  if (direction === "right") this.playerCol++;

  if (
      this.playerRow >= 0 &&
      this.playerRow < this.field.length &&
      this.playerCol >= 0 &&
      this.playerCol < this.field[0].length
    ) {
      this.field[this.playerRow][this.playerCol] = pathCharacter;
    }
  }


checkStatus() {
    if (
    this.playerRow < 0 ||
    this.playerRow >= this.field.length ||
    this.playerCol < 0 ||
    this.playerCol >= this.field[0].length
  ) {
    return "out";
  } else if (this.field[this.playerRow][this.playerCol] === hole) {
    return "hole";
  } else if (this.field[this.playerRow][this.playerCol] === hat) {
    return "hat";
  } else {
    return "safe";
  }};

static generateField(level = 1) {
  let size = 2 + level;
  let rows = size;
  let columns = size;
  let field = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < columns; j++) {
      row.push(fieldCharacter);
    }
    field.push(row);
  }
  let hatRow, hatCol;
  let hatPlaced = false;
  while (!hatPlaced) {
    let randomRow = Math.floor(Math.random() * rows);
    let randomCol = Math.floor(Math.random() * columns);
    if (
      (randomRow > 1 || randomCol > 1) && // not in 2x2 safe zone
      field[randomRow][randomCol] !== hole
    ) {
      field[randomRow][randomCol] = hat;
      hatRow = randomRow;
      hatCol = randomCol;
      hatPlaced = true;
    }
  }
  function isNearHat(r, c, hatRow, hatCol) {
    return Math.abs(r - hatRow) <= 1 && Math.abs(c - hatCol) <= 1;
  }

  let numHoles = Math.floor((rows * columns * 0.2));
  while (numHoles > 0) {
    let randomRow = Math.floor(Math.random() * rows);
    let randomCol = Math.floor(Math.random() * columns);
    if (
      (randomRow > 1 || randomCol > 1) && // not in 2x2 safe zone
      field[randomRow][randomCol] !== hole &&
      field[randomRow][randomCol] !== hat &&
      !isNearHat(randomRow, randomCol, hatRow, hatCol)
    ) {
      field[randomRow][randomCol] = hole;
      numHoles--;
    }
  }

  field[0][0] = pathCharacter;
  return field;

}

};

document.addEventListener("keydown", (e) => {
    if (!myField || !gameActive) return;

    let moved = false;
    if (e.key === "ArrowUp") { myField.move("up"); moved = true; }
    if (e.key === "ArrowDown") { myField.move("down"); moved = true; }
    if (e.key === "ArrowLeft") { myField.move("left"); moved = true; }
    if (e.key === "ArrowRight") { myField.move("right"); moved = true; }

    if (!moved) return;

    const gameStatus = myField.checkStatus();
    
    if (gameStatus === "safe") {
       myField.field[myField.playerRow][myField.playerCol] = pathCharacter;
       myField.print();

    } else if (gameStatus === "hat") {
        myField.showMessage("You found the hat!", false); 
        gameActive = false;
        currentLevel++;
        updateLevelDisplay();

        setTimeout(() => {
            document.getElementById("message-overlay").classList.add("hidden"); 
        }, 700);

        setTimeout(() => {
            myField = new Field(Field.generateField(currentLevel), currentLevel);
            myField.print();
            gameActive = true;
        }, 750);

    } else if (gameStatus === "hole" || gameStatus === "out") {
        myField.showMessage("Game Over!", true);
        gameActive = false;
    }
});
