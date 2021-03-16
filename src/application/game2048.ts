export const sum = (a: number, b: number) => a + b;

export enum Movement {
  RIGHT = 'right',
  LEFT = 'left',
  DOWN = 'down',
  UP = 'up'
}

type Cell = number | null
type BoardRow = [Cell, Cell, Cell, Cell];
export type Board = [BoardRow, BoardRow, BoardRow, BoardRow];

interface GeneratedPiece {
  row: number;
  col: number;
  value: number;
}

export type PieceGenerator = (Board: Board) => GeneratedPiece;

const randomGenerator: PieceGenerator = (board: Board) => {
  const value = Math.random() > 0.9 ? 4 : 2;
  const defaultPiece: GeneratedPiece = { row: 0, col: 0, value };

  const emptyCells = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (!board[row][col]) emptyCells.push([row, col]);
    }
  }
  if (emptyCells.length === 0) return defaultPiece;

  const index = Math.floor(Math.random() * emptyCells.length);
  const [row, col] = emptyCells[index];
  return { row, col, value };
};

export enum GameStatus { WON, PLAYING, LOST }

export default class Game2048 {
  static fromString(boardAsText: string, pieceGenerator?: PieceGenerator): Game2048 {
    const rows = boardAsText.trim().split('\n').map((row) => row.trim().split(''));
    const board: Board = rows.map((row) => row.map((char: string) => ((char === '_') ? null : Number(char)))) as Board;
    return new Game2048(board, pieceGenerator);
  }

  static randomGame(pieceGenerator?: PieceGenerator): Game2048 {
    const board = Array(4).fill(null).map(() => Array(4).fill(null));
    const game = new Game2048(board as Board, pieceGenerator);
    game.spawnPiece();
    return game;
  }

  private _board: Board;

  private status: GameStatus = GameStatus.PLAYING;

  private pieceGenerator: PieceGenerator;

  constructor(board: Board, pieceGenerator: PieceGenerator = randomGenerator) {
    this._board = board;
    this.pieceGenerator = pieceGenerator;
  }

  cellAt(row: number, col: number): Cell {
    return this._board[row][col];
  }

  board(): Board {
    return JSON.parse(JSON.stringify(this._board));
  }

  moveTo(move: Movement): void {
    if (this.status === GameStatus.LOST) return;

    const oldBoard = this.board();

    if (move === Movement.RIGHT) this.moveHorizontally(Movement.RIGHT);
    if (move === Movement.LEFT) this.moveHorizontally(Movement.LEFT);
    if (move === Movement.DOWN) this.moveVertically(Movement.DOWN);
    if (move === Movement.UP) this.moveVertically(Movement.UP);

    if (JSON.stringify(oldBoard) !== JSON.stringify(this._board)) {
      this.spawnPiece();
    }

    this.testIfIsLost();
  }

  moveHorizontally(move: Movement) {
    for (let row = 0; row < 4; row++) {
      let newRow = this._board[row].filter((cell) => cell !== null);

      const step = move === Movement.RIGHT ? -1 : 1;
      const cols = move === Movement.RIGHT ? [3, 2, 1] : [0, 1, 2];
      const fill = (rowToFill: Cell[]) => (move === Movement.RIGHT
        ? rowToFill.unshift(null)
        : rowToFill.push(null));

      cols.forEach((col) => {
        if (newRow[col] && newRow[col] === newRow[col + step]) {
          newRow[col] = (newRow[col] as number) * 2;
          if (newRow[col] === 2048) this.status = GameStatus.WON;
          newRow[col + step] = null;
          newRow = newRow.filter((cell) => cell !== null);
        }
      });

      while (newRow.length < 4) fill(newRow);
      this._board[row] = newRow as BoardRow;
    }
  }

  moveVertically(move: Movement) {
    const transposedMove = move !== Movement.DOWN ? Movement.LEFT : Movement.RIGHT;
    this.transpose();
    this.moveHorizontally(transposedMove);
    this.transpose();
  }

  transpose(): void {
    const transposed = Array(4).fill(null).map(() => Array(4)) as Board;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        transposed[col][row] = this._board[row][col];
      }
    }
    this._board = transposed;
  }

  won(): boolean {
    return this.status === GameStatus.WON;
  }

  lost(): boolean {
    return this.status === GameStatus.LOST;
  }

  spawnPiece(): void {
    const { row, col, value } = this.pieceGenerator(this.board());
    this._board[row][col] = value;
  }

  testIfIsLost(): void {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (!this._board[row][col]) return;

        const coordsToCheck = [[-1, 0], [1, 0], [0, 1], [0, -1]];
        for (let i = 0; i < coordsToCheck.length; i++) {
          const [dRow, dCol] = coordsToCheck[i];
          const nRow = row + dRow;
          const nCol = col + dCol;
          if (nRow < 0 || nCol < 0) continue;
          if (nRow > 3 || nCol > 3) continue;
          if (this._board[nRow][nCol] === this._board[row][col]) return;
        }
      }
    }
    this.status = GameStatus.LOST;
  }
}
