import { positiveNegativeConversion, provideStep, givePieceInfo, pawnEatings, updatePieceInfo, deleteRowCol, containPiece, provideSpecial } from "../model/data.js";
import { move as send } from "../view/task/task.js";
import { chessCheck } from "./check.js";


const blocked = function ([gRow, gCol], [row, col]) {
  try {
    const curPieceObj = givePieceInfo([row, col]);
    const goingPieceObj = givePieceInfo([gRow, gCol]);

    if (typeof goingPieceObj !== "object") return true;
    if (curPieceObj.type === goingPieceObj.type) {
      return true;
    } else return false;

  } catch (err) {
    return true;
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
const prepareKing = function ([row, col], check) {
  const pieceObj = givePieceInfo([row, col]);
  const { step } = provideStep(pieceObj.name);
  const { upDown } = pieceObj;
  const side = upDown 
  const extracting = Object.keys(step);
  const dArr = {};
  extracting.forEach(dir => {
    let [mRow, mCol] = step[dir];
    mRow = side === 0 ? positiveNegativeConversion(mRow) : mRow;
    mCol = side === 0 ? positiveNegativeConversion(mCol) : mCol;
    const curRow = row + mRow;
    const curCol = col + mCol;

    dArr[dir] = [];
    try {
      
      if (!containPiece([curRow, curCol])) {
        dArr[dir] = [curRow, curCol];
      }
      if (containPiece([curRow, curCol]) && !compareType([row, col], [curRow, curCol])) {
        dArr[dir] = [curRow, curCol];
      }
    } catch (err) {
      return
    }
  });
  
  if(check) return chessCheck(dArr, pieceObj.type);
  return dArr;
  
  
};
const pawnEats = function ([row, col]) {
  const { upDown } = givePieceInfo([row, col]);
  const side = upDown;
  const eatObj = pawnEatings();
  const eatings = Object.keys(eatObj);
  const eat = {};
  eatings.forEach(eatDir => {

    let gRow = side === 0 ? positiveNegativeConversion(eatObj[eatDir][0]) + row : eatObj[eatDir][0] + row;
    let gCol = side === 0 ? positiveNegativeConversion(eatObj[eatDir][1]) + col : eatObj[eatDir][1] + col;
    try {
      if (((gRow >= 0 && gRow <= 7) && (gCol >= 0 && gCol <= 7))) {
        eat[eatDir] = [gRow, gCol];
      }
    } catch (err) {
      return;
    }

  });

  return eat;
};
const preparePawn = function ([row, col]) {
  const pawnData = givePieceInfo([row, col]);
  const { step } = provideStep(pawnData.name);

  const { top } = step;

  const side = pawnData.upDown;

  let obj = {};
  const [stRow, stCol] = top;
  const fRow = side === 0 ? positiveNegativeConversion(stRow) + row : stRow + row;
  const fCol = side === 0 ? positiveNegativeConversion(stCol) + col : stCol + col;

  try {
    if (!containPiece([fRow, fCol])) {
      obj = { ...obj, top: [fRow, fCol] };
    }

  } catch (err) {
    console.log("Top Move");
    console.error(err);
  }
  try {

    const special = provideSpecial(pawnData.name);
    const sRow = side === 0 ? positiveNegativeConversion(special.doubleTop[0]) + row : special.doubleTop[0] + row;
    const sCol = side === 0 ? positiveNegativeConversion(special.doubleTop[1]) + col : special.doubleTop[1] + col;

    if (!containPiece([fRow, fCol]) && !containPiece([sRow, sCol]) && pawnData.moved === false) {

      obj = { ...obj, doubleTop: [sRow, sCol] };

    }

  } catch (err) {
    console.log("Special Move");
    console.error(err);

  }
  const eatObj = pawnEats([row, col]);

  const eatings = Object.keys(eatObj);

  const eat = {};
  eatings.forEach((dir) => {
    const [gRow, gCol] = eatObj[dir];
    try {
      if (containPiece([gRow, gCol])) {
        if (!compareType([row, col], [gRow, gCol])) {
          eat[eatDir] = [gRow, gCol];
        }
      }
    } catch (err) {
      return;
    }
  });

  obj = { ...obj, ...eat };
  return obj;
};

const prepareKnight = function ([row, col]) {
  const pieceObj = givePieceInfo([row, col]);
  const { side } = pieceObj;
  const { step } = provideStep(pieceObj.name);
  const extracting = Object.keys(step);
  const dArr = {};
  extracting.forEach(dir => {
    let [mRow, mCol] = step[dir];
    mRow = side === 0 ? positiveNegativeConversion(mRow) : mRow;
    mCol = side === 0 ? positiveNegativeConversion(mCol) : mCol;
    const curRow = row + mRow;
    const curCol = col + mCol;

    dArr[dir] = [];
    try {
      if (!containPiece([curRow, curCol])) {
        dArr[dir] = [curRow, curCol];
      }
      if (containPiece([curRow, curCol]) && !compareType([row, col], [curRow, curCol])) {
        dArr[dir] = [curRow, curCol];
      }
    } catch (err) {
      return;
    }
  });
  return dArr;

};
const moves = function ([row, col], name, side) {
  if (name === "pawn") {
    const pawnMoves = preparePawn([row, col]);
    return pawnMoves;
  }


  if (name === "king") {
    const kingMoves = prepareKing([row, col], true);

    
    return kingMoves;
  }
  if (name === "knight") {
    const knightMoves = prepareKnight([row, col]);
    return knightMoves;
  }
  if (name === "queen" || name === "rook" || name === "bishop") {
    let curRow = row;
    let curCol = col;
    const dArr = {};
    const { direction } = provideStep(name);
    const extracting = Object.keys(direction);
    extracting.forEach(dir => {
      let [mRow, mCol] = direction[dir];
      mRow = side === 0 ? positiveNegativeConversion(mRow) : mRow;
      mCol = side === 0 ? positiveNegativeConversion(mCol) : mCol;
      dArr[dir] = [];
      // Reinitialize
      curRow = row;
      curCol = col;

      curRow += mRow;
      curCol += mCol;
      while (true) {
        try {
          if (containPiece([curRow, curCol])) {
            const trfa = compareType([curRow, curCol], [row, col]);
            if (!trfa) {
              dArr[dir].push([curRow, curCol]);
              break;
            }
            break;
          };
          dArr[dir].push([curRow, curCol]);
          curRow += mRow;
          curCol += mCol;
        } catch (err) {
          break;
        }
      }

    });
    return dArr;
  }
};







const kingEatables = function ([row, col]) {

};

const eatables = function ([row, col]) {


};
const possibleMove = function ([row, col]) {
  const pieceObj = givePieceInfo([row, col]);
  const pieceName = pieceObj.name;
  const side = pieceObj.upDown;
  const step = moves([row, col], pieceName, side);
  return step;

};


const move = function ([row, col], [gRow, gCol]) {
  send([row, col], [gRow, gCol]);
  deleteRowCol();
};
export { move, possibleMove, pawnEats, prepareKing, provideStep };
