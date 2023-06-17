import { givePieceInfo, giveGrid, findKing } from "../model/data.js";
import { possibleMove, pawnEats } from "./movement.js";
import { arrayConverter } from "./util.js";
import { pawnEatings } from "../model/data.js";


const getPieceMove = function ([row, col]) {
	const { name } = givePieceInfo([row, col]);
	if (name === "pawn") {
		return pawnEats([row, col]);
	}
	return possibleMove([row, col], false);
};

const defendKing = function (dArr, canGo) {
	const dArrFormatted = {};
	const keys = Object.keys(dArr);
	for(const key of keys) {
		if(dArr[key][0] === undefined) continue;
		if(typeof dArr[key][0] === "number") {
			const [ ro, co ] = dArr[key];
			for(const [dRo, dCo] of canGo) {
				if(ro === dRo && co === dCo) {
				 	dArrFormatted[key] = dArr[key]; 
				}
			}
			continue;
		}
		if(Array.isArray(dArr[key][0])) {
			dArrFormatted[key] = []
			const arrLen = dArr[key].length;
			for(let i = 0; i < arrLen; i++) {
				const [ro, co] = dArr[key][i];
				for(const [dRo, dCo] of canGo) {
					if(ro === dRo && co === dCo) dArrFormatted[key].push([ro, co]);
				}
			continue;
			}
		}
	};
	return dArrFormatted;
}

const pinnedCheck = function (arrObj, type) {
	const keys = Object.keys(arrObj);
	for (let row = 0; row <= 7; row++) {
		for (let col = 0; col <= 7; col++) {
			const getPieceInfo = givePieceInfo([row, col]);
			if (getPieceInfo.name === undefined) continue;
			if (getPieceInfo.type === type) continue;


			const pieceMoves = getPieceMove([row, col]);

			const ke = Object.keys(pieceMoves);

			// king's move
			for (const key of keys) {
				// when king can't move at this direction
				if (arrObj[key][0] === undefined) continue;
				const [kR, kC] = arrObj[key];
				// other moves (loop over each direction)
				for (const dir of ke) {
					const data = pieceMoves[dir];
					// if direction is long
					if (data[0] === undefined) continue;
					if (Array.isArray(data[0])) {
						for (const [r, c] of data) {
							if (r === kR && c === kC) {
								arrObj[key] = [];
							}
						}
						continue;
					}
					// if direction is just one step
					if (typeof data[0] === "number") {
						if (data[0] === kR && data[1] === kC) {
							arrObj[key] = [];
						}
						continue;
					}

				}
				// moves
			}
		}
	};
	return arrObj;
};
const chessCheck = function (type) {

	const kingPosition = findKing(type);
	const [kRow, kCol] = kingPosition;
	for (let row = 0; row <= 7; row++) {
		for (let col = 0; col <= 7; col++) {
			const getPieceInfo = givePieceInfo([row, col]);
			if (getPieceInfo.name === undefined) continue;
			if (getPieceInfo.type === type) continue;


			const pieceMoves = getPieceMove([row, col]);
			const checkArr = arrayConverter(pieceMoves);


			const keys = Object.keys(pieceMoves);
			for (const key of keys) {
				const data = pieceMoves[key];
				// if direction is long
				if (data[0] === undefined) continue;
				if (Array.isArray(data[0])) {
					for (const [r, c] of data) {
						if (r === kRow && c === kCol) {
							return data;
						}
					}
					continue;
				}
				// if direction is just one step

				if (typeof data[0] === "number") {
					const [r, c] = data;
					if (kRow === r && kCol === c) {
						return data;
					}
					continue;
				}

			}



			// for (const [ro, co] of checkArr) {
			// 	if (kRow === ro && kCol === co) return true;
			// }

		}
	}
	return [];

};



export { pinnedCheck, defendKing, chessCheck };

