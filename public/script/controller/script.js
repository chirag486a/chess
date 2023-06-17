"use script";
// data
import { givePieceInfo, updateRowCol, provideRowCol, deleteRowCol, updatePieceInfo, createPieceInfo, containPiece, updateTurn } from "../model/data.js";
// view
import { designBoard, piecePlace } from "../view/design/design.js";
import { boardListener as listenToBoard } from "../view/task/handler.js";
import { retriveRowCol } from "../view/util/utility.js";
import { moveOnOffLight, clickLight } from "../view/task/task.js";
// control/movement
import { move, possibleMove } from "./movement.js";
import { pinnedCheck, chessCheck } from "./check.js";
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
		if(preRowCol !== null) unLight(preRowCol);
		light([row, col]);
		
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
