
    console.log(document.getElementById("rules-box")); // Should NOT be null
console.log(document.getElementById("message-text")); // Should NOT be null

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

class Field {
  constructor(field, level = 1) {
    this.field = field;
    this.playerRow = 0;
    this.playerCol = 0;
    this.level = level;
  }
  
print() {
  const grid = document.getElementById("field-grid");
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
  grid.innerHTML = html;
}

showMessage(message, showButton = true, isWin = false) {
    document.getElementById("message-text").textContent = message;
    document.getElementById("message-overlay").classList.remove("hidden");
    const btn = document.getElementById("play-again-btn");
    btn.style.display = showButton ? "block" : "none";
    btn.textContent = isWin ? "Next Level" : "Play Again";
    btn.onclick = () => {
        document.getElementById("message-overlay").classList.add("hidden");
        if (isWin) {
            myField = new Field(Field.generateField(currentLevel), currentLevel);
        } else {
            currentLevel = 1;
            updateLevelDisplay();
            myField = new Field(Field.generateField(currentLevel), currentLevel);
        }
        myField.print();
        gameActive = true;
    };
}

move(direction) {
  if (direction === "up") this.playerRow--;
  if (direction === "down") this.playerRow++;
  if (direction === "left") this.playerCol--;
  if (direction === "right") this.playerCol++;
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

    let direction;
    if (e.key === "ArrowUp") direction = "up";
    if (e.key === "ArrowDown") direction = "down";
    if (e.key === "ArrowLeft") direction = "left";
    if (e.key === "ArrowRight") direction = "right";
    if (!direction) return;

    e.preventDefault(); 

    myField.move(direction);

    const gameStatus = myField.checkStatus();

    if (gameStatus === "hat") {
    gameActive = false;
    currentLevel++;
    updateLevelDisplay();
    myField.showMessage("You found the hat! Next level...", true, true); 
} else if (gameStatus === "hole" || gameStatus === "out") {
    gameActive = false;
    myField.showMessage("Game Over!", true, false); 
} else if (gameStatus === "safe") {
    myField.field[myField.playerRow][myField.playerCol] = pathCharacter;
    myField.print();
}

});
