// Utility
import { addClass, createImgElement, addId, selectZone, appendEl, blankHTML, addressify } from "../util/utility.js";
// Selects
import { board } from "../task/selects.js";
// Env
import { IMAGE_DIRECTORY } from "../../env.js";
import { nestLoop } from "../../utility.js";


// Designing Board
const designBoard = function () {
  const createField = function ([row, col]) {
    const currentField = document.createElement("div");
    addClass(currentField, `item`);// adding class
    if ((col + row) % 2 === 1) currentField.classList.add("darken");
    currentField.dataset.row = `${row}`;
    currentField.dataset.col = `${col}`;
    appendEl(board, currentField);
  };
  nestLoop(createField);
};

export { designBoard };
