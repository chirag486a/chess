import { board } from "./selects.js";
import { appendEl, lightOff, lightOn, selectZone } from "../util/utility.js";

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


export {
  moveWhere,
  moveWhich,
  move,
  moveOnOffLight,
  clickLight,
	deleteElement,
};
