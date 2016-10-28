import { Piece } from '../../Objects/Piece';

export class Rule {
    static minRow = 1;
    static maxRow = 10;
    static minCol = 1;
    static maxCol = 9;

    // get key for boardStates for a position
    static pos2key(currRow, currCol) {
        return currRow + "-" + currCol;
    }
    // get [row, col]] for key in boardStates 
    static key2pos(k) {
        return k.split("-").map(x => parseInt(x));
    }


    // return moves within board range and escape current position
    static filterBoundedMoves(currRow, currCol, moves, boardStates, team) {
        // filter out invalied move
        console.log(currRow)
        console.log(currCol)
        return moves.filter(m => (
            (m[0] != currRow || m[1] != currCol) &&
            m[0] >= this.minRow &&
            m[0] <= this.maxRow &&
            m[1] <= this.maxCol &&
            m[1] >= this.minCol &&
            !((m[0] + "-" + m[1]) in boardStates && boardStates[m[0] + "-" + m[1]].team == team)
        ))
    }

    static movesOnSameLine(currRow, currCol, boardStates, team) {
        var moves = [];
        for (var i = currRow + 1; i <= this.maxRow; i++) {
            var k = this.pos2key(i, currCol);
            if (k in boardStates) {
                if (boardStates[k].team != team) moves.push(boardStates[k].position);
                break;
            }
            moves.push([i, currCol]);
        }
        for (var j = currRow - 1; j >= this.minRow; j--) {
            var k = this.pos2key(j, currCol);
            if (k in boardStates) {
                if (boardStates[k].team != team) moves.push(boardStates[k].position);
                break;
            }
            moves.push([j, currCol]);
        }
        for (var i = currCol + 1; i <= this.maxCol; i++) {
            var k = this.pos2key(currRow, i);
            if (k in boardStates) {
                if (boardStates[k].team != team) moves.push(boardStates[k].position);
                break;
            }
            moves.push([currRow, i]);
        }
        for (var j = currCol - 1; j >= this.minCol; j--) {
            var k = this.pos2key(currRow, j);
            if (k in boardStates) {
                if (boardStates[k].team != team) moves.push(boardStates[k].position);
                break;
            }
            moves.push([currRow, j]);
        }
        return moves;
    }

    // Ju
    static possibleMovesForJu(currRow, currCol, boardStates, team) {
        return this.movesOnSameLine(currRow, currCol, boardStates, team);
    }

    // Ma
    static possibleMovesForMa(currRow, currCol, boardStates) {
        var moves = [];
        if (!(this.pos2key(currRow + 1, currCol) in boardStates)) {
            moves.push([currRow + 2, currCol + 1]);
            moves.push([currRow + 2, currCol - 1]);
        }
        if (!(this.pos2key(currRow - 1, currCol) in boardStates)) {
            moves.push([currRow - 2, currCol + 1]);
            moves.push([currRow - 2, currCol - 1]);
        }
        if (!(this.pos2key(currRow, currCol + 1) in boardStates)) {
            moves.push([currRow + 1, currCol + 2]);
            moves.push([currRow - 1, currCol + 2]);
        }
        if (!(this.pos2key(currRow, currCol - 1) in boardStates)) {
            moves.push([currRow + 1, currCol - 2]);
            moves.push([currRow - 1, currCol - 2]);
        }
        return moves;
    }



    static findFirstOpponentOnRow(row, startCol, states, team, incFn){
            while (startCol >= this.minCol && startCol <= this.maxCol){
                var k = this.pos2key(row, startCol);
                if(k in states){
                    if(states[k].team == team) return ;
                    else return [row, startCol];
                }
                startCol = incFn(startCol);
            }
    }
    static findFirstOpponentOnCol(col, startRow, states, team, incFn){
            while (startRow >= this.minRow && startRow <= this.maxRow){
                var k = this.pos2key(startRow, col);
                if(k in states){
                    if(states[k].team == team) return;
                    else return [startRow, col];
                }
                startRow = incFn(startRow);
            }
    }


    // Pao
    static possibleMovesForPao(currRow, currCol, boardStates, team) {
        var inc = (x=>x+1);
        var dec = (x=>x-1);
        var moves =[];
        for (var i = currRow + 1; i <= this.maxRow; i++) {
            var k = this.pos2key(i, currCol);
            if (k in boardStates) {
                var next = this.findFirstOpponentOnCol(currCol, i+1, boardStates, team, inc);
                if(next) moves.push(next);
                break;
            }
            moves.push([i, currCol]);
        }
        for (var j = currRow - 1; j >= this.minRow; j--) {
            var k = this.pos2key(j, currCol);
            if (k in boardStates) {
                 var next = this.findFirstOpponentOnCol(currCol, j-1, boardStates, team, dec);
                if(next) moves.push(next);
                break;
            }
            moves.push([j, currCol]);
        }
        for (var i = currCol + 1; i <= this.maxCol; i++) {
            var k = this.pos2key(currRow, i);
            if (k in boardStates) {
                var next = this.findFirstOpponentOnRow(currRow, i+1, boardStates, team, inc);
                if(next) moves.push(next);
                break;
            }
            moves.push([currRow, i]);
        }
        for (var j = currCol - 1; j >= this.minCol; j--) {
            var k = this.pos2key(currRow, j);
            if (k in boardStates) {
                var next = this.findFirstOpponentOnRow(currRow, j-1, boardStates, team, dec);
                if(next) moves.push(next);
                break;
            }
            moves.push([currRow, j]);
        }
        return moves;
    }

    // Shi
    static possibleMovesForShi(currRow, currCol, boardStates) {
        var moves = [];
        if (2 == currRow) { // in the center
            moves = [
                [currRow - 1, currCol + 1],
                [currRow - 1, currCol - 1],
                [currRow + 1, currCol + 1],
                [currRow + 1, currCol - 1]
            ];
        } else {
            moves = [[2, 5]];
        }
        return moves;
    }

    // King
    static possibleMovesForKing(currRow, currCol, boardStates) {
        var moves = [];
        for (var i = 4; i <= 6; i++)  moves.push([currRow, i]);
        for (var j = 1; j <= 3; j++) moves.push([j, currCol]);
        return moves.filter(x => ((x[0] - currRow) * (x[0] - currRow) + (x[1] - currCol) * (x[1] - currCol)) < 2);
    }

    // Xiang
    static possibleMovesForXiang(currRow, currCol, boardStates) {
        var moves = [];
        if (!(((currRow + 1) + "-" + (currCol + 1)) in boardStates)) moves.push([currRow + 2, currCol + 2]);
        if (!(((currRow + 1) + "-" + (currCol - 1)) in boardStates)) moves.push([currRow + 2, currCol - 2]);
        if (!(((currRow - 1) + "-" + (currCol + 1)) in boardStates)) moves.push([currRow - 2, currCol + 2]);
        if (!(((currRow - 1) + "-" + (currCol - 1)) in boardStates)) moves.push([currRow - 2, currCol - 2]);
        return moves;
    }

    // Zu
    static possibleMovesForZu(currRow, currCol, boardStates) {
        var beyond = currRow > 5; //beyond the river
        var moves = [[currRow + 1, currCol]];
        if (beyond) {
            moves.push([currRow, currCol - 1]);
            moves.push([currRow, currCol + 1]);
        }
        return moves;
    }



    // all legal moves for a piece in a board state
    // return [(row, col)]
    static possibleMoves = function (piece: Piece, boardStates) {
        var name = piece.name[0];
        var currRow = piece.position[0];
        var currCol = piece.position[1];
        var moves = [];
        switch (name) {
            case 'j':
                moves = this.possibleMovesForJu(currRow, currCol, boardStates);
                break
            case 'm':
                moves = this.possibleMovesForMa(currRow, currCol, boardStates);
                break
            case 'x':
                moves = this.possibleMovesForXiang(currRow, currCol, boardStates);
                break
            case 's':
                moves = this.possibleMovesForShi(currRow, currCol, boardStates);
                break
            case 'k':
                moves = this.possibleMovesForKing(currRow, currCol, boardStates);
                break
            case 'p':
                moves = this.possibleMovesForPao(currRow, currCol, boardStates);
                break
            case 'z':
                moves = this.possibleMovesForZu(currRow, currCol, boardStates);
                break
        }
        return this.filterBoundedMoves(currRow, currCol, moves, boardStates, piece.team);

    }


}
