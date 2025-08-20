const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";
const playerIcon = "👾";

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

  const cellWidth = grid.clientWidth / columns;
  const cellHeight = grid.clientHeight / rows;
  const fontSize = Math.min(cellWidth, cellHeight) * 0.6; // 60% of cell

  let html = `<div class="field-grid" style="display: grid; width:100%; height:100%; grid-template-columns: repeat(${columns}, 1fr); grid-template-rows: repeat(${rows}, 1fr);">`;

   for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let cell = this.field[r][c];
      if (r === this.playerRow && c === this.playerCol) {
        cell = playerIcon; 
      }
      

  html += '</div>';
  grid.innerHTML = html;
}
   }
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
    if (isWin) {
        setTimeout(() => {
            document.getElementById("message-overlay").classList.add("hidden");
            myField = new Field(Field.generateField(currentLevel), currentLevel);
            myField.print();
            gameActive = true;
        }, 450);
    }
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

static isPathAvailable(field, startRow, startCol, hatRow, hatCol) {
  let visited = Array.from({ length: field.length }, () => Array(field[0].length).fill(false));
  let queue = [[startRow, startCol]];
  visited[startRow][startCol] = true;

  while (queue.length > 0) {
    let [r, c] = queue.shift();

    if (r === hatRow && c === hatCol) return true;

    let directions = [[1,0],[-1,0],[0,1],[0,-1]];
    for (let [dr, dc] of directions) {
      let nr = r + dr, nc = c + dc;
      if (
        nr >= 0 && nr < field.length &&
        nc >= 0 && nc < field[0].length &&
        !visited[nr][nc] &&
        field[nr][nc] !== hole
      ) {
        visited[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }
  return false;
}
static generateField(level = 1) {
let rows = 2 + level;
let columns = 2 + level;

  let field = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < columns; j++) {
      row.push(fieldCharacter);
    }
    field.push(row);
  }
 
 let startRow = 0, startCol = 0;
 let hatRow = rows - 1, hatCol = columns - 1;

let path = [[startRow, startCol]];
let currentRow = startRow;
let currentCol = startCol;

while (currentRow !== hatRow || currentCol !== hatCol) {
      let moves = [];
      if (currentRow < hatRow) moves.push([currentRow + 1, currentCol]);
      if (currentCol < hatCol) moves.push([currentRow, currentCol + 1]);
      if (currentRow > hatRow) moves.push([currentRow - 1, currentCol]);
      if (currentCol > hatCol) moves.push([currentRow, currentCol - 1]);

      let [nextRow, nextCol] = moves[Math.floor(Math.random() * moves.length)];
      path.push([nextRow, nextCol]);
      currentRow = nextRow;
      currentCol = nextCol;
  }

  for (let [r, c] of path) {
      field[r][c] = pathCharacter;
  }

  field[hatRow][hatCol] = hat;
let numHoles = Math.floor(rows * columns * 0.2);
  while (numHoles > 0) {
      let r = Math.floor(Math.random() * rows);
      let c = Math.floor(Math.random() * columns);
      if (field[r][c] === fieldCharacter) {
          field[r][c] = hole;
          numHoles--;
      }
  }

  field[startRow][startCol] = pathCharacter;
  return field;
  }
}

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
    myField.showMessage("You found the hat! Next level...", false, true); 
} else if (gameStatus === "hole" || gameStatus === "out") {
    gameActive = false;
    myField.showMessage("Game Over!", true, false); 
} else if (gameStatus === "safe") {
    myField.field[myField.playerRow][myField.playerCol] = pathCharacter;
    myField.print();
}


});
