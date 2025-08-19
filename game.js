const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

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

}



const myField = new Field(Field.generateField());
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

if (status === "out" || status === "hole" || status === "hat") {
  alert(status === "hat" ? "YOU FOUND THE HAT!" : "Game Over!");
  location.reload();
}
});

