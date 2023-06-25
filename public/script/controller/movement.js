import { provideStep, givePieceInfo, pawnEatings, deleteRowCol, containPiece, provideSpecial, findKing, getTurn, updateTurn, deletePieceInfo, updatePieceInfo } from "../model/data.js";
import { move as send, deleteElement } from "../view/task/task.js";
import { pinnedCheck, defendKing, chessCheck } from "./check.js";
import { arrayConverter, positiveNegativeConversion, compareType } from "./util.js";



const prepareKing = function ([row, col], check) {
  const pieceObj = givePieceInfo([row, col]);

  const { step } = provideStep(pieceObj.name);
  const { upDown, type } = pieceObj;
  const side = upDown;
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



  if (check) {

    if (pieceObj.moved === false) {

      const leftRookCol = side === 0 ? 7 : 0;
      const rightRookCol = side === 0 ? 0 : 7;
      const rookRow = side === 1 ? 7 : 0;


      const selectRightRook = givePieceInfo([rookRow, rightRookCol]);
      const selectLeftRook = givePieceInfo([rookRow, leftRookCol]);

      console.log(selectRightRook, selectLeftRook);

      if (selectRightRook.moved === false) {

        const { doubleRight } = provideSpecial("king");
        const [mRow, mCol] = doubleRight;

        const sRow = side === 0 ? positiveNegativeConversion(mRow) + row : mRow + row;
        const sCol = side === 0 ? positiveNegativeConversion(mCol) + col : mCol + col;

        const { right } = step;

        const rRow = side === 0 ? positiveNegativeConversion(right[0]) + row : right[0] + row;
        const rCol = side === 0 ? positiveNegativeConversion(right[1]) + col : right[1] + col;

        const sCheck = chessCheck([sRow, sCol], type)[0] === undefined ? true : false;
        const rCheck = chessCheck([rRow, rCol], type)[0] === undefined ? true : false;

        const sContainPiece = containPiece([sRow, sCol]);
        const rContainPiece = containPiece([rRow, rCol]);

        if (sCheck && rCheck && !sContainPiece && !rContainPiece) {
          if (type === "W") dArr.doubleRight = [sRow, sCol];
          if (type === "B") {
            const wCRow = sRow;
            const wCCol = sCol + 1;
            if (!containPiece([wCRow, wCCol])) dArr.doubleRight = [sRow, sCol];
          }
        }
      }
      if (selectLeftRook.moved === false) {
        const { doubleLeft } = provideSpecial("king");
        const [mRow, mCol] = doubleLeft;

        const sRow = side === 0 ? positiveNegativeConversion(mRow) + row : mRow + row;
        const sCol = side === 0 ? positiveNegativeConversion(mCol) + col : mCol + col;

        const { left } = step;

        const lRow = side === 0 ? positiveNegativeConversion(left[0]) + row : left[0] + row;
        const lCol = side === 0 ? positiveNegativeConversion(left[1]) + col : left[1] + col;

        const sCheck = chessCheck([sRow, sCol], type)[0] === undefined ? true : false;
        const lCheck = chessCheck([lRow, lCol], type)[0] === undefined ? true : false;

        const sContainPiece = containPiece([sRow, sCol]);
        const lContainPiece = containPiece([lRow, lCol]);

        if (sCheck && lCheck && !sContainPiece && !lContainPiece) {
          if (type === "B") dArr.doubleLeft = [sRow, sCol];
          if (type === "W") {
            const wCRow = sRow;
            const wCCol = sCol + 1;
            if (!containPiece([wCRow, wCCol])) dArr.doubleLeft = [sRow, sCol];
          }
        }

      }

    }
    const chek = chessCheck([row, col], type);
    const keys = Object.keys(dArr);
    for (const key of keys) {
      if (chek[0] === undefined) break;
      if (typeof dArr[key][0] === "number") {
        const [ro, co] = dArr[key];
        for (const [row, col] of chek) {
          if (!(ro === row && co === col)) continue;
          let opposite;
          switch (key) {
            case "right": opposite = "left"; break;
            case "left": opposite = "right"; break;

            case "top": opposite = "bottom"; break;
            case "bottom": opposite = "top"; break;

            case "topLeft": opposite = "bottomRight"; break;
            case "bottomRight": opposite = "topLeft"; break;

            case "topRight": opposite = "bottomLeft"; break;
            case "bottomLeft": opposite = "topRight"; break;

            default: opposite = "";
          }
          dArr[opposite] = [];
        }
      }
    }
    const pinnedArea = pinnedCheck(dArr, pieceObj.type);
    return pinnedArea;
  }

  return dArr;


};
const pawnEats = function ([row, col]) {
  const { upDown } = givePieceInfo([row, col]);
  const side = upDown;
  const eatObj = pawnEatings([row, col]);
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



const preparePawn = function ([row, col], check) {
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
          if (dir !== "left" && dir !== "right") eat[dir] = [gRow, gCol];
        }
      }
      if (!containPiece([gRow, gCol])) {
        if (dir === "topLeft") {
          if (eatObj.left !== undefined) {
            const [lRow, lCol] = eatObj.left;
            const lPieceInfo = givePieceInfo([lRow, lCol]);
            if (lPieceInfo.name === "pawn" && lPieceInfo.canPass === true) eat[dir] = [gRow, gCol];
          }
        }
        if (dir === "topRight") {
          if (eatObj.right !== undefined) {
            const [rRow, rCol] = eatObj.right;
            const rPieceInfo = givePieceInfo([rRow, rCol]);
            if (rPieceInfo.name === "pawn" && rPieceInfo.canPass === true) eat[dir] = [gRow, gCol];


          }
        }
      }
    } catch (err) {
      return;
    }
  });

  obj = { ...obj, ...eat };
  if (!check) return obj;
  // check for king check
  const type = pawnData.type;
  const king = findKing(type);
  const chek = chessCheck(king, type);
  if (chek[0] !== undefined) {
    const defendZone = defendKing(obj, chek);
    return defendZone;
  }
  return obj;

};

const prepareKnight = function ([row, col], check) {
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

  if (!check) return dArr;
  const type = pieceObj.type;
  const king = findKing(type);
  const chek = chessCheck(king, type);
  if (chek[0] !== undefined) {
    return defendKing(dArr, chek);
  }


  return dArr;

};
const queenRookBishop = function ([row, col], name, side) {
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
};
const moves = function ([row, col], name, side, check) {
  if (name === "pawn") {
    const pawnMoves = preparePawn([row, col], check);
    return pawnMoves;
  }
  if (name === "king") {
    const kingMoves = prepareKing([row, col], check);
    return kingMoves;
  }
  if (name === "knight") {
    const knightMoves = prepareKnight([row, col], check);
    return knightMoves;
  }
  if (name === undefined) return {};
  // name === (queen||rook||bishop)
  const dArr = queenRookBishop([row, col], name, side);

  if (!check) return dArr;
  const pieceObj = givePieceInfo([row, col]);
  const type = pieceObj.type;
  const king = findKing(type);
  const chek = chessCheck(king, type);
  if (chek[0] !== undefined) {
    return defendKing(dArr, chek);
  }
  return dArr;
};



const possibleMove = function ([row, col], check) {
  const pieceObj = givePieceInfo([row, col]);
  const pieceName = pieceObj.name;
  const side = pieceObj.upDown;
  const step = moves([row, col], pieceName, side, check);
  return step;
};

const moveChecker = function ([row, col], [gRow, gCol]) {
  const moves = possibleMove([row, col], true);
  const movesArr = arrayConverter(moves);
  if (movesArr[0] === undefined) return false;

  for (const [r, c] of movesArr) {
    if (r === gRow && c === gCol) return true;
  }

  return false;

};


const deletePiece = function ([row, col]) {
  deletePieceInfo([row, col]);
};



const checkPawnSpecial = function ([row, col], [gRow, gCol]) {


  const pieceInfo = givePieceInfo([row, col]);
  pieceInfo.canPass = false;
  const { upDown: side } = pieceInfo;
  if (pieceInfo.moved === false) {
    const special = provideSpecial("pawn");

    const { doubleTop } = special;
    const [dTRow, dTCol] = doubleTop;

    const mRow = side === 0 ? positiveNegativeConversion(dTRow) + row : dTRow + row;
    const mCol = side === 0 ? positiveNegativeConversion(dTCol) + col : dTCol + col;

    if (mRow === gRow && mCol === gCol) {
      pieceInfo.canPass = true;
    }

  }

  if (col !== gCol) {
    if (!containPiece([gRow, gCol])) {
      const deleteRow = side === 0 ? +1 + gRow : 1 + gRow;
      const deleteCol = gCol;

      console.log(deleteRow, deleteCol);
      deletePiece([deleteRow, deleteCol]);
      deleteElement([deleteRow, deleteCol]);

    }
  }
};


const kingSpecialChecker = function ([row, col], [gRow, gCol]) {
  const pieceInfo = givePieceInfo([row, col]);

  const moves = possibleMove([row, col], true);
  const { moved: kMoved } = pieceInfo;
  const { upDown: side } = pieceInfo;

  if (kMoved === true) return false;
  const rSpecial = provideSpecial("rook");

  const { left, right } = rSpecial;

  const { doubleLeft: doubleLeftMove, doubleRight: doubleRightMove } = moves;

  if (doubleLeftMove !== undefined) {
    const [kingDestinationRow, kingDestinationCol] = doubleLeftMove;

    if (gRow === kingDestinationRow && gCol === kingDestinationCol) {

      const rookRow = row;
      const rookCol = side === 0 ? 7 : 0;

      const rookSpecialRow = row;
      const rookSpecialCol = side === 1 ? left[1] + rookCol : right[1] + rookCol;

     console.log(rookSpecialRow, rookSpecialCol); 
      updatePieceInfo([rookRow, rookCol], [rookSpecialRow, rookSpecialCol]);
      send([rookRow, rookCol], [rookSpecialRow, rookSpecialCol]);
    }

  }
  if (doubleRightMove !== undefined) {
   const [kingDestinationRow, kingDestinationCol] = doubleRightMove;

    if (gRow === kingDestinationRow && gCol === kingDestinationCol) {

      const rookRow = row;
      const rookCol = side === 0 ? 0 : 7;

      const rookSpecialRow = row;
      const rookSpecialCol = side === 1 ? right[1] + rookCol : left[1] + rookCol;

      updatePieceInfo([rookRow, rookCol], [rookSpecialRow, rookSpecialCol]);
      send([rookRow, rookCol], [rookSpecialRow, rookSpecialCol]);
    }
  }

};

const move = function ([row, col], [gRow, gCol]) {
  const pieceInfo = givePieceInfo([row, col]);
  if (!moveChecker([row, col], [gRow, gCol])) return false;
  if (pieceInfo.name === "pawn") checkPawnSpecial([row, col], [gRow, gCol]);
  const { type } = pieceInfo;
  if (!(type === getTurn())) return false;
  if (containPiece([gRow, gCol])) deletePieceInfo([gRow, gCol]);
  if (pieceInfo.name === "king") kingSpecialChecker([row, col], [gRow, gCol]);
  send([row, col], [gRow, gCol]);
  updateTurn(type === "W" ? "B" : "W");
  deleteRowCol();
  return true;
};
export { move, possibleMove, pawnEats, prepareKing, provideStep };
