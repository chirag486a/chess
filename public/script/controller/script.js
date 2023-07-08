"use script";
// data
import { givePieceInfo, updateRowCol, provideRowCol, deleteRowCol, updatePieceInfo, createPieceInfo, containPiece, getTurn } from "../model/data.js";
// view
import { designBoard } from "../view/design/design.js";
import { boardListener as listenToBoard } from "../view/task/handler.js";
import { retriveRowCol } from "../view/util/utility.js";
import { moveOnOffLight, clickLight, piecePlace } from "../view/task/task.js";
// control/movement
import { move, possibleMove } from "./movement.js";
// utility
import { arrayConverter } from "./util.js";
import { nestLoop } from "../utility.js";


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

const checkEat = function (preRowCol, [gRow, gCol]) {
	const [row, col] = preRowCol;
	const pieceMoves = possibleMove([row, col], true);

	const curPieceInfo = givePieceInfo([row, col]);
	const goPieceInfo = givePieceInfo([gRow, gCol]);



	if (curPieceInfo.type === goPieceInfo.type) return false;

	const pieceArr = arrayConverter(pieceMoves);

	if (pieceArr[0] === undefined) return false;
	for (const [row, col] of pieceArr) {
		if (row === gRow && col === gCol) return true;
	}
	return false;
};

const runOnPieceClicked = function (preRowCol, [row, col]) {
	const previouslyClicked = preRowCol;
	const willGo = [row, col];
	if (previouslyClicked !== null) {
		const pieceInfo = givePieceInfo([row, col]);
		const { type } = pieceInfo;
		if (type !== getTurn()) return;
		unLight(previouslyClicked);
		light([row, col]);
		if (preRowCol[0] === row && preRowCol[1] === col) {
			unLight(preRowCol);
			return;
		}
		const canEat = checkEat(previouslyClicked, willGo);
		if (canEat) {
			unLight(previouslyClicked);
			if (move(previouslyClicked, willGo)) updatePieceInfo(previouslyClicked, willGo);
			return;
		}
	} else {
		const pieceInfo = givePieceInfo([row, col]);
		const { type } = pieceInfo;
		if (type !== getTurn()) return;
		light([row, col]);
	}
};

const onClick = function ([row, col]) {
	const previouslyClicked = provideRowCol();
	const contains = containPiece([row, col]);

	if (contains) {
		runOnPieceClicked(previouslyClicked, [row, col]);
	} else if (!contains) {
		if (previouslyClicked === null) return;
		unLight(previouslyClicked);
		if (move(previouslyClicked, [row, col])) updatePieceInfo(previouslyClicked, [row, col]);
	}
};


// When Zone is clicked 
const clickZone = function () {
	listenToBoard(onClick);
};

// client
const piecePlacement = function () {
	const placer = function ([row, col]) {
		const pieceIn = givePieceInfo([row, col]);
		const pieceName = pieceIn.name;
		if (!pieceName) return;
		const pieceType = pieceIn.type;
		piecePlace([row, col], pieceName, pieceType);

	};
	nestLoop(placer)
};



// INIT function
const init = function () {
	createPieceInfo(0, 7);
	designBoard();
	clickZone();
	piecePlacement();
};
init();
