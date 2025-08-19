const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

let myField;

document.getElementById("start-btn").onclick = function() {
  document.getElementById("rules-screen").classList.add("hidden");
  myField = new Field(Field.generateField());
  myField.print();
};


document.getElementById("play-again").onclick = function() {
  document.getElementById("message-overlay").classList.add("hidden");
  myField.print();
}

class Field {
  constructor(field) {
    this.field = field;
    this.playerRow = 0;
    this.playerCol = 0;
  }
  

print() {
  const board = document.getElementById("game-board");
  let html = '<div class="field-grid">';
  for (let row of this.field) {
    for (let cell of row) {
      html += `<div class="field-cell">${cell}</div>`;
    }
  }
  html += '</div>';
  board.innerHTML = html;
}

showMessage(message) {
    document.getElementById("message-text").textContent = message;
    document.getElementById("message-overlay").classList.remove("hidden");
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

static generateField() {
    let rows = 3;
    let columns = 3;
    let field = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < columns; j++) {
        row.push(fieldCharacter);
      }
      field.push(row);
    }

    let numHoles = 2;
    while (numHoles > 0) {
      let randomRow = Math.floor(Math.random() * rows);
      let randomCol = Math.floor(Math.random() * 3);
      if (
        (randomRow !== 0 || randomCol !== 0) &&
        field[randomRow][randomCol] !== hole
      ) {
        field[randomRow][randomCol] = hole;
        numHoles--;
      }
    }
    let hatPlaced = false;
    while (!hatPlaced) {
      let randomRow = Math.floor(Math.random() * rows);
      let randomCol = Math.floor(Math.random() * columns);
      if (
        (randomRow !== 0 || randomCol !== 0) && // not the start
        field[randomRow][randomCol] !==  hole // not a hole
      ) {
        field[randomRow][randomCol] = hat;
        hatPlaced = true;
      }
    }
    field[0][0] = pathCharacter;
    return field;
  }

};
  myField = new Field(Field.generateField());
  myField.print();


document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") myField.move("up");
    if (e.key === "ArrowDown") myField.move("down");
    if (e.key === "ArrowLeft") myField.move("left");
    if (e.key === "ArrowRight") myField.move("right");


    const status = myField.checkStatus();
    if (status === "safe") {
       myField.field[myField.playerRow][myField.playerCol] = pathCharacter;
    }
    myField.print();
    function showMessage(message) {
    document.getElementById("message-text").textContent = message;
    document.getElementById("message-overlay").classList.remove("hidden");
   }

   if (status === "hat") {
  showMessage("You found the hat!");
} else if (status === "hole" || status === "out") {
  showMessage("Game Over!");
}

});
