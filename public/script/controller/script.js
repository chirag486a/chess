"use script";
// data
import { givePieceInfo, updateRowCol, provideRowCol, deleteRowCol, updatePieceInfo, createPieceInfo, containPiece } from "../model/data.js";
// view
import { designBoard, piecePlace } from "../view/design/design.js";
import { boardListener as listenToBoard } from "../view/task/handler.js";
import { retriveRowCol } from "../view/util/utility.js";
import { moveOnOffLight, clickLight } from "../view/task/task.js";
// control/movement
import { move, possibleMove } from "./movement.js";
// utility
import { arrayConverter } from "./util.js";


const light = function ([row, col]) {
	const possibleMoves = possibleMove([row, col], true);
	const m = arrayConverter(possibleMoves);
	moveOnOffLight(m, true);
	clickLight([row, col], true);
	updateRowCol([row, col]);
	return;
};
const unLight = function ([pRow, pCol]) {
	// if empty zone is clicked previous
	if (pRow === null || pCol === null) return;
	// LIGHT DOWN
	const possibleMoves = possibleMove([pRow, pCol], true);
	const m = arrayConverter(possibleMoves);
	moveOnOffLight(m, false);
	clickLight([pRow, pCol], false);
	deleteRowCol();
};

const checkEat = function(preRowCol, [gRow, gCol]) {
	if(preRowCol === null) return;
	const [row, col] = preRowCol;  
	const pieceMoves = possibleMove([row, col], true);
	
	const curPieceInfo = givePieceInfo([row, col]);
	const goPieceInfo = givePieceInfo ([gRow, gCol]);


	
	if(curPieceInfo.type === goPieceInfo.type) return false;

	const pieceArr = arrayConverter(pieceMoves);

	if(pieceArr[0] === undefined) return false;
	for(const [row, col] of pieceArr) {
		if(row === gRow && col === gCol) return true;
	}
	return false
}


const onClick = function (ev) {
	const element = ev.target;
	const [row, col] = retriveRowCol(element);
	const preRowCol = provideRowCol();
	const contains = containPiece([row, col]);
	const pieceInfo = givePieceInfo([row, col]);
	const {type} = pieceInfo;
	
	
	if (contains) {
		if (preRowCol !== null && preRowCol[0] === row && preRowCol[1] === col) {
			unLight([row, col]);
			return;
		}
		if(preRowCol !== null) {
		 unLight(preRowCol);
			const canEat = checkEat(preRowCol, [row, col]);
			if(canEat){
				if(move(preRowCol, [row, col])) {
						updatePieceInfo(preRowCol, [row, col]);
						return;
				}
			}
		}
		if(!checkEat(preRowCol, [row, col])) light([row, col]);
	//	chessCheck([row, col]);
	} else if (!contains) {
		if (preRowCol === null) return;
		unLight(preRowCol);
		if(move(preRowCol, [row, col])) updatePieceInfo(preRowCol, [row, col]);
	}
};


// When Zone is clicked 
const clickZone = function () {
	listenToBoard(onClick);
};

const piecePlacement = function () {

	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			const pieceIn = givePieceInfo([i, j]);
			const pieceName = pieceIn.name;
			if (!pieceName) continue;
			const pieceType = pieceIn.type;
			piecePlace([i, j], pieceName, pieceType);
		}
	}
};


// INIT function
const init = function () {
	createPieceInfo(7, 0);
	designBoard();
	clickZone();
	piecePlacement();
};
init();
