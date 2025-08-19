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
    document.getElementById("game-board").innerHTML =
    this.field.map(row => row.join(" ")).join("<br>");
}
static generateField() {
    let rows = 3;
    let columns = 3;
    let field = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < columns; j++) {
        row.push("░");
      }
      field.push(row);
    }

    let numHoles = 2;
    while (numHoles > 0) {
      let randomRow = Math.floor(Math.random() * rows);
      let randomCol = Math.floor(Math.random() * 3);
      if (
        (randomRow !== 0 || randomCol !== 0) &&
        field[randomRow][randomCol] !== "O"
      ) {
        field[randomRow][randomCol] = "O";
        numHoles--;
      }
    }
    let hatPlaced = false;
    while (!hatPlaced) {
      let randomRow = Math.floor(Math.random() * rows);
      let randomCol = Math.floor(Math.random() * columns);
      if (
        (randomRow !== 0 || randomCol !== 0) && // not the start
        field[randomRow][randomCol] !== "O" // not a hole
      ) {
        field[randomRow][randomCol] = "^";
        hatPlaced = true;
      }
    }
    field[0][0] = "*";
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
        myField.field[myField.playerRow][myField.playerCol] = "*"
    }
    myField.print();

    if (status === "out" || status === "hole" || status === "hat"){
    alert(status === "hat" ? "YOU FOUND THE HAT!" : "Game Over!");
    location.reload();
}
});

