// Utility
import { addClass, createImgElement, addId, selectZone, appendEl, blankHTML, addressify } from "../util/utility.js";
// Selects
import { board } from "../task/selects.js";
// Env
import { IMAGE_DIRECTORY } from "../../env.js";

const ROWS = 8, COLUMNS = 8;

const grid = [];
// Designing Board
const designBoard = function () {
  let counter = 0;
  // CREATE element for board
  for (let row = ROWS; row > 0; row--) {
    // FOR each iteration create row
    let gridRow = [];
    for (let col = COLUMNS; col > 0; col--) {
      // Create Element
      const currentField = document.createElement("div");

      // addClass(currentField, `item-${counter}`);// adding class
      addClass(currentField, `item`);// adding class

      // Push Each Squares to row
      gridRow.push(currentField);
      counter++;
    }
    // Push Each row To grid
    grid.push(gridRow);
  }

  // APPEND Squares to board
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      // Color Board
      if ((col + row) % 2 === 1) grid[col][row].classList.add("darken");

      // Indexify square DATASET
      grid[col][row].dataset.row = `${row}`;
      grid[col][row].dataset.col = `${col}`;
      
      // const row_col = document.createTextNode(`[${row}, ${col}]`);
      // grid[col][row].appendChild(row_col);


      // APPEND SQUARE
      appendEl(board, grid[col][row])
    }
  }
};

const piecePlace = function([row, col], name, type) {
	const address = addressify(IMAGE_DIRECTORY,type, name);
	const zone = selectZone([row, col])
	blankHTML(zone);
	const el = createImgElement(address);
	appendEl(zone,el);
}


export { designBoard, grid, piecePlace};
