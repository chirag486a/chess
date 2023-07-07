import { board } from "./selects.js";
import { appendEl, lightOff, lightOn, selectZone, addressify, blankHTML, createImgElement } from "../util/utility.js";
import { IMAGE_DIRECTORY } from "../../env.js";

const moveOnOffLight = function (movableArr, onOff) {
  try {
    for (const [row, col] of movableArr) {
      const el = selectZone([row, col]);

      if (onOff) lightOn(el, "moveLight");
      else lightOff(el, "moveLight");
    }
  } catch (err) {
    console.error(err);
  }
};
const clickLight = ([row, col], onOff) => {
  try {
    const el = selectZone([row, col]);
    onOff ? lightOn(el, "clickLight") : lightOff(el, "clickLight");
    return el;
  } catch (err) {
    throw Error(`clickLight: ${err.message} el: ${el} onOff: ${onOff}`);
  }
};


const moveWhich = function ([row, col]) {
  const fromEl = selectZone([row, col]);
  const whichEl = fromEl.firstChild;
  return whichEl;
};
const moveWhere = function ([row, col]) {
  const whichEl = selectZone([row, col]);
  return whichEl;
};
const move = function ([row, col], [dRow, dCol]) {
  const whichEl = moveWhich([row, col]);
  const whereEl = moveWhere([dRow, dCol]);
	deleteElement([dRow, dCol]);
  appendEl(whereEl, whichEl);

};



const deleteElement = function([row, col]){
	const selectEl = selectZone([row, col]);
	selectEl.innerHTML = "";	

}
const piecePlace = function ([row, col], name, type) {
  const address = addressify(IMAGE_DIRECTORY, type, name);
  const zone = selectZone([row, col]);
  blankHTML(zone);
  const el = createImgElement(address);
  appendEl(zone, el);
};




export {
  moveWhere,
  moveWhich,
  move,
  moveOnOffLight,
  clickLight,
	deleteElement,
  piecePlace
};
