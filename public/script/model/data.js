// localstorege
const lId = "clicked";
const localStorageMovableId = "movable";

let ROWS = 8;
let COLUMNS = 8;
const grid = [];
// backend
const fillGrid = function () {
	for (let i = 0; i < ROWS; i++) {
		const gridRows = [];
		for (let j = 0; j < COLUMNS; j++) {
			gridRows.push({});
		}
		grid.push(gridRows);
	}
};
fillGrid();
// Backend
const createPieceInfo = function (white_position, black_position) {
	const leftRook = grid[white_position][0];
	leftRook.name = "rook";
	leftRook.moved = false;

	const rightRook = grid[white_position][7];
	rightRook.name = "rook";
	rightRook.moved = false;

	const leftKnight = grid[white_position][1];
	leftKnight.name = "knight";

	const rightKnight = grid[white_position][6];
	rightKnight.name = "knight";

	const king = grid[white_position][3];
	king.name = "king";
	king.moved = false;

	const queen = grid[white_position][4];
	queen.name = "queen";

	const rightBishop = grid[white_position][5];
	rightBishop.name = "bishop";

	const leftBishop = grid[white_position][2];
	leftBishop.name = "bishop";

	// white pieces done now below copy property of white for black with some property changed
	for (let i = 0; i < COLUMNS; i++) {
		grid[black_position][i].name = grid[white_position][i].name;
		grid[black_position][i].defended = false;
		grid[white_position][i].defended = false;
		grid[black_position][i].type = "B";
		grid[white_position][i].type = "W";
		grid[black_position][i].upDown = black_position === 7 ? 1 : 0;
		grid[white_position][i].upDown = white_position === 0 ? 0 : 1;
		const pName = grid[black_position][i].name;
		if (pName === "knight" || pName === "rook" || pName === "bishop") {
			if (i < 3) {
				grid[black_position][i].side = "left";
				grid[white_position][i].side = "left";

			}
			if (i > 3) {
				grid[black_position][i].side = "right";
				grid[white_position][i].side = "right";
			}
		}
		const six = white_position === 7 ? 6 : 1;
		const one = black_position === 0 ? 1 : 6;

		// if white is six then sixth is white pawn and oneth is black and vice-versa
		const sixth = grid[six][i];
		const oneth = grid[one][i];
		sixth.name = "pawn";
		sixth.defended = false;
		sixth.label = [six, i];
		sixth.moved = false;
		sixth.canPass = false;
		sixth.type = "W";
		sixth.upDown = six === 6 ? 1 : 0;

		oneth.name = "pawn";
		oneth.label = [one, i];
		oneth.defended = false;
		oneth.moved = false;
		oneth.canPass = false;
		oneth.type = "B";
		oneth.upDown = one === 1 ? 0 : 1;
	}

};
console.log(grid);
const givePieceInfo = function ([row, col]) {
	try {
		//	console.log((row >= 0 && row <= 7 && col >= 0 && col <= 7));
		if (!((row >= 0 && row <= 7) && (col >= 0 && col <= 7)))
			throw new Error("OUT OF BOARD");
		else return grid[row][col];
	} catch (err) {
		throw Error(err.message);
	}

};
const containPiece = function ([row, col]) {
	try {
		const pieceData = givePieceInfo([row, col]);
		if (pieceData.name !== undefined) return true;
		else return false;
	} catch (err) {
		throw Error(err.message)
	}

};
const findKing = function (type) {
	for (let i = 0; i <= 7; i++) {
		for (let j = 0; j <= 7; j++) {
			const pieceInFo = givePieceInfo([i, j])
			if (pieceInFo.name === "king" && pieceInFo.type === type) return [i, j];
		}
	}
};


// UPDATE GRID
const king = function ([preRow, preCol], [movdRow, movdCol]) {
	grid[movdRow][movdCol] = JSON.parse(JSON.stringify(grid[preRow][preCol]));
	grid[preRow][preCol] = {};
	return;
};

const pawn = function ([preRow, preCol], [movdRow, movdCol]) {
	grid[movdRow][movdCol] = JSON.parse(JSON.stringify(grid[preRow][preCol]));
	grid[movdRow][movdCol].moved = true;
	grid[preRow][preCol] = {};
	return;
};

const updatePieceInfo = function ([preRow, preCol], [movdRow, movdCol]) {
	let preObj = grid[preRow][preCol];
	const preName = preObj.name;
	if (preName === "pawn") {
		pawn([preRow, preCol], [movdRow, movdCol]);
		return;
	}
	if (preName === "king") {
		king([preRow, preCol], [movdRow, movdCol]);
		return;
	}
	grid[movdRow][movdCol] = { ...preObj };
	grid[preRow][preCol] = {};

};

// ATTACKED PIECES
const deletedPiece = {
	W: [],
	B: [],
}

const deletePieceInfo = function([row, col]) {

	const pieceInfo = givePieceInfo([row, col]);

	deletedPiece[pieceInfo.type]  = {... pieceInfo}	

	grid[row][col] = {};

}


// Row & Col which was selected previously
let rowCol = [];
const updateRowCol = function ([row, col]) {
	rowCol = [row, col];
};
const provideRowCol = function () {
	if (rowCol[0] === undefined) return null;
	return rowCol;
};
const deleteRowCol = function () {
	rowCol = [];
};
const giveGrid = function () {
	return grid;

};



// Valid data

const top = [-1, 0];
const doubleTop = [-2, 0];
const bottom = [1, 0];
const double_bottom = [2, 0];

const right = [0, 1];
const doubleRight = [0, 2];
const left = [0, -1];
const doubleLeft = [0, -2];
const tripleLeft = [0, -3];

const topRight = [-1, 1];
const bottomRight = [1, 1];

const topLeft = [-1, -1];
const bottomLeft = [1, -1];


// [row, col]
// l top_right left [-2, 1]
// l top_right top [-1, 2]

// l bottom_right left [2, 1]
// l bottom_right bottom [1, 2]

// l bottom_left right [2, -1]
// l bottom_left bottom [1, -2]

// l top_left right [-2, -1]
// l top_left top [-1, -2]

// Initial l = L
// t = top
// b = bottom
// r = right
// l = left
// the last word indicates which direction L is facing
// Initial l refers to L
// eg: ltrl
// l = L move
// tr = Top Right
// l = Facing left
// eg: lblb
// l = L move
// bl = Bottom Left
// b = Facing bottom


const ltrr = [-2, 1];
const ltrb = [-1, 2];
const lbrr = [2, 1];
const lbru = [1, 2];
const lbll = [2, -1];
const lblt = [1, -2];
const ltll = [-2, -1];
const ltlb = [-1, -2];

const valid = {
	knight: {
		step: {
			ltrr,
			ltrb,
			lbrr,
			lbru,
			lbll,
			lblt,
			ltll,
			ltlb
		},
	},
	bishop: {
		direction: {
			topRight,
			bottomRight,
			bottomLeft,
			topLeft
		},
	},
	queen: {
		direction: {
			top,
			topRight,
			right,
			bottomRight,
			bottom,
			bottomLeft,
			left,
			topLeft
		},
	},
	rook: {
		direction: {
			top,
			right,
			bottom,
			left
		},
	},
	king: {
		step: {
			top,
			topRight,
			right,
			bottomRight,
			bottom,
			bottomLeft,
			left,
			topLeft
		}
	},
	pawn: {
		step: {
			top
		}
	}


};

const pawnEatings = function () {
	return {
		topRight,
		topLeft
	};
};

const special = {
	king: {
		left: doubleLeft,
		right: doubleRight
	},
	rook: {
		left: doubleRight,
		right: tripleLeft
	},
	pawn: {
		 doubleTop
	}
};

const provideSpecial = function (name) {
	if(typeof special[name] !== "object") throw new Error(`No Special Moves For ${name}`)
	return special[name];
}

// export as getStep
const provideStep = function (name) {
	if (name === "knight" || name === "pawn" || name === "king") {
		return valid[name];
	}
	if (name === "queen" || name === "rook" || name === "bishop") {
		return valid[name];
	}
};








// Whose turn is it
let turn = "W";
const updateTurn = function(updatedTurn) {
	turn = updatedTurn;
} 
const getTurn = function() {
	return turn;
}




export {
	provideStep,
	createPieceInfo,
	givePieceInfo,
	pawnEatings,
	containPiece,
	updateRowCol,
	provideRowCol,
	updatePieceInfo,
	deleteRowCol,
	giveGrid,
	provideSpecial,
	findKing,
	getTurn,
	updateTurn,
	deletePieceInfo
};
