import { givePieceInfo, giveGrid } from "../model/data.js";
import { possibleMove, pawnEats, prepareKing } from "./movement.js";
import { arrayConverter } from "./util.js";
import { pawnEatings } from "../model/data.js";


const getPieceMove = function ([row, col]) {
	const { name } = givePieceInfo([row, col]);
	if (name === "pawn") {
		return pawnEats([row, col]);
	}
	if (name === "king") return prepareKing([row, col], false);
	return possibleMove([row, col]);
};

const chessCheck = function (arrObj, type) {
	const keys = Object.keys(arrObj);
	for (let row = 0; row <= 7; row++) {
		for (let col = 0; col <= 7; col++) {
			const getPieceInfo = givePieceInfo([row, col]);
			if (getPieceInfo.name === undefined) continue;
			if (getPieceInfo.type === type) continue;


			const pieceMoves = getPieceMove([row, col]);
			const checkArr = arrayConverter(pieceMoves);
			for (const key of keys) {
				const [row, col] = arrObj[key];
				for (const [cRow, cCol] of checkArr) {

					if (row === cRow && col === cCol) arrObj[key] = [];
				}
			}

		}
	}
	return arrObj;
};






export { chessCheck };

