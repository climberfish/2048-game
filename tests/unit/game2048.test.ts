import Game2048, { Board, Movement, PieceGenerator } from '@/application/game2048';
import 'jest-extended';

describe('Game2048 tests', () => {
  let pieceGenerator: (row: number, col: number) => PieceGenerator;

  beforeAll(() => {
    pieceGenerator = (row, col) => (board: Board) => ({ value: 2, row, col });
  })

  test('transpõe board', () => {
    const jogo: Game2048 = Game2048.fromString(`
      1___
      _2_2
      __3_
      __34
    `);
    const esperado: Game2048 = Game2048.fromString(`
      1___
      _2__
      __33
      _2_4
    `);
    jogo.transpose();
    expect(jogo.board()).toEqual(esperado.board());
  });

  test('cria um jogo à partir de um texto', () => {
    const jogo: Game2048 = Game2048.fromString(`
      ____
      ____
      ____
      __22
    `);

    expect(jogo.cellAt(0, 0)).toBeNull();
    expect(jogo.cellAt(2, 2)).toBeNull();
    expect(jogo.cellAt(3, 2)).toBe(2);
    expect(jogo.cellAt(3, 3)).toBe(2);
  });

  test('move blocos no movimento à direita', () => {
    const jogo: Game2048 = Game2048.fromString(`
      4_8_
      4__8
      __48
      __8_
    `, pieceGenerator(0, 0));
    const esperado: Game2048 = Game2048.fromString(`
      2_48
      __48
      __48
      ___8
    `);
    jogo.moveTo(Movement.RIGHT);
    expect(jogo.board()).toEqual(esperado.board());
  });

  test('mescla blocos no movimento à direita', () => {
    const jogo: Game2048 = Game2048.fromString(`
      4444
      _444
      __44
      ___4
    `, pieceGenerator(0, 0));
    const esperado: Game2048 = Game2048.fromString(`
      2_88
      __48
      ___8
      ___4
    `)
    jogo.moveTo(Movement.RIGHT);
    expect(jogo.board()).toEqual(esperado.board())
  });

  test('move blocos no movimento à esquerda', () => {
    const jogo: Game2048 = Game2048.fromString(`
      _4_8
      4__8
      48__
      __8_
    `, pieceGenerator(0, 3));
    const esperado: Game2048 = Game2048.fromString(`
      48_2
      48__
      48__
      8___
    `);
    jogo.moveTo(Movement.LEFT);
    expect(jogo.board()).toEqual(esperado.board())
  });
  
  test('mescla blocos no movimento à esquerda', () => {
    const jogo: Game2048 = Game2048.fromString(`
      4444
      444_
      44__
      4___
    `, pieceGenerator(0, 3));
    const esperado: Game2048 = Game2048.fromString(`
      88_2
      84__
      8___
      4___
    `)
    jogo.moveTo(Movement.LEFT);
    expect(jogo.board()).toEqual(esperado.board())
  });

  test('move blocos no movimento para baixo', () => {
    const jogo: Game2048 = Game2048.fromString(`
      _44_
      _8_4
      8___
      __88
    `, pieceGenerator(0, 3));
    const esperado: Game2048 = Game2048.fromString(`
      ___2
      ____
      _444
      8888
    `);
    jogo.moveTo(Movement.DOWN);
    expect(jogo.board()).toEqual(esperado.board())
  });

  test('mescla blocos no movimento para baixo', () => {
    const jogo: Game2048 = Game2048.fromString(`
      4444
      444_
      44__
      4___
    `, pieceGenerator(0, 3));
    const esperado: Game2048 = Game2048.fromString(`
      ___2
      ____
      84__
      8884
    `)
    jogo.moveTo(Movement.DOWN);
    expect(jogo.board()).toEqual(esperado.board())
  });

  test('move blocos no movimento para cima', () => {
    const jogo: Game2048 = Game2048.fromString(`
      __88
      8___
      _8_4
      _44_
    `, pieceGenerator(3, 3));
    const esperado: Game2048 = Game2048.fromString(`
      8888
      _444
      ____
      ___2
    `);
    jogo.moveTo(Movement.UP);
    expect(jogo.board()).toEqual(esperado.board())
  });

  test('mescla blocos no movimento para cima', () => {
    const jogo: Game2048 = Game2048.fromString(`
      4___
      44__
      444_
      4444
    `, pieceGenerator(3, 3));
    const esperado: Game2048 = Game2048.fromString(`
      8884
      84__
      ____
      ___2
    `)
    jogo.moveTo(Movement.UP);
    expect(jogo.board()).toEqual(esperado.board())
  });

  test('ganha o jogo ao formar 2048', () => {
    const jogo: Game2048 = new Game2048([
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, 1024],
      [null, null, null, 1024],
    ]);
    expect(jogo.won()).toBeFalse();
    jogo.moveTo(Movement.DOWN);
    expect(jogo.won()).toBeTrue();
  });

  test('perde o jogo', () => {
    const jogo: Game2048 = new Game2048([
      [null, 4, 8, 16],
      [2, 4, 8, 16],
      [4, 8, 16, 32],
      [8, 16, 32, 64],
    ], pieceGenerator(0, 3));
    expect(jogo.lost()).toBeFalse();
    jogo.moveTo(Movement.LEFT);
    expect(jogo.lost()).toBeTrue();
  });

  test('Se a jogada não for possível, não gera peça', () => {
    const jogo: Game2048 = Game2048.fromString(`
      ____
      ____
      ____
      ___2
    `, pieceGenerator(0, 3));
    const oldBoard = JSON.parse(JSON.stringify(jogo.board()));
    jogo.moveTo(Movement.RIGHT);
    expect(jogo.board()).toEqual(oldBoard);
  });
});
