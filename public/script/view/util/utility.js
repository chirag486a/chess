
// UTILITY
// Create Element
const createImgElement = function (address) {
  const piece = document.createElement("img");
  piece.src = address;
  return piece;
};
// Manipulate Element
const appendEl = function (where, what) {
  where.appendChild(what);
};
const addClass = function (el, className) {
  el.classList.add(className);
};
const addId = function (el, idName) {
  el.id = idName;
  return el;
};
const blankHTML = function (where) {
  where.innerHTML = "";
  return where;
};


// Zone
const selectZone = function ([row, col]) {
  return document.querySelector(`[data-row = "${row}"][data-col = "${col}"]`);
};

const retriveRowCol = function (el) {
  const rowCol = el.closest(".item").dataset;
  return [Number(rowCol.row),Number(rowCol.col)];
};
const addressify = (addr, type, name) => `${addr}${type}${name}.png`;
// ---------------------------------------------------
// click functionality

const lightOn = function (el, className) {
  el.closest(".item").classList.add(className);
};
const lightOff = function (el, className) {
  el.closest(".item").classList.remove(className);
};


// Listener
const listen = function (type = "click", el, func) {
  el.addEventListener(type, function (ev) {
    func(ev);
  });
};
export {
  createImgElement,
  addClass,
  addId,
  selectZone,
  listen,
  appendEl,
  retriveRowCol,
  addressify,
  blankHTML,
  lightOff,
  lightOn,

};
