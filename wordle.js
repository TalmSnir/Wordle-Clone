const boardSection = document.querySelector('.board');
const keyPadsSection = document.querySelector('.keys');
const body = document.body;
class Game {
  constructor(wordList, wordLength) {
    this.wordLength = wordLength;
    this.wordList = wordList;
  }
  startGame() {
    this.buildBoard();
    this.buildKeyPad();
  }
  buildBoard() {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < this.wordLength; i++) {
      const row = document.createElement('div');
      row.classList.add('flex', 'justify-center', 'items-center', 'gap-4');
      for (let j = 0; j < this.wordLength; j++) {
        const cell = document.createElement('div');
        cell.classList.add(
          'border',
          'border-slate-700',
          'p-2',
          'text-slate-100',
          'h-16',
          'aspect-square'
        );
        row.appendChild(cell);
      }
      fragment.appendChild(row);
    }
    boardSection.appendChild(fragment);
  }
  buildKeyPad() {
    const rows = [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'delete'],
    ];
    const fragment = document.createDocumentFragment();
    rows.forEach(row => {
      const keysRow = document.createElement('div');
      keysRow.classList.add('flex', 'gap-2', 'uppercase');
      row.forEach(key => {
        const keyPad = document.createElement('kbd');
        keyPad.classList.add(
          'inline-block',
          'text-slate-50',
          'p-4',
          'rounded',
          'text-xl',
          'bg-gray-400'
        );
        keyPad.textContent = key;
        keyPad.onClick = e => {
          this.handleKeyPress(e);
        };
        keysRow.appendChild(keyPad);
      });
      fragment.appendChild(keysRow);
    });
    keyPadsSection.appendChild(fragment);
  }
  checkWord(params) {}
  handleKeyPress(e) {}
}
const wordList = ['jazzy', 'close', 'world', 'hello', 'blaze', 'joker'];
const game = new Game(wordList, 5);
game.startGame();
