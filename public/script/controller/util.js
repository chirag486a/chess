"use strict";
import { givePieceInfo } from "../model/data.js"; //violation but two seperate file needed it  
const arrayConverter = function (obj) {
  const keys = Object.keys(obj);
  const arr = [];
  keys.forEach((prop, index) => {

    if (obj[prop][0] === undefined) return;
    if (Array.isArray(obj[prop][0])) {
      for (const [row, col] of obj[prop]) {
        arr.push([row, col]);
      }
    }
    if (typeof obj[prop][0] === "number") {
      arr.push(obj[prop]);
    }
  });

  return arr;

};

// Positive Negative
const positiveNegativeConversion = function (num) {
	if (num > 0) {
		return num * -1;
	} else if (num < 0) {
		return Math.abs(num);
	} else {
		return 0;
	}
};



const compareType = function ([row, col], [gRow, gCol]) {
  try {
    const pieceObj = givePieceInfo([row, col]);
    const pieceType = pieceObj.type;

    const goingPieceObj = givePieceInfo([gRow, gCol]);
    const goingPieceType = goingPieceObj.type;

    if (pieceType !== goingPieceType) return false;
    else return true;
  } catch (err) {
    throw Error(err.message);
  }
};




export {arrayConverter, positiveNegativeConversion, compareType} 
