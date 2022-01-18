class Game {
  constructor(wordList, wordLength) {
    this.wordLength = wordLength;
    this.wordList = wordList;
    this.currentRowId = 0;
    this.currentRow = null;
    this.tries = [];
    this.currentWord = '';
    this.chosenWord = null;
    this.boardSection = document.querySelector('.board');
    this.keyPadsSection = document.querySelector('.keys');
    this.rows = null;
    this.keys = {
      q: null,
      w: null,
      e: null,
      r: null,
      t: null,
      y: null,
      u: null,
      i: null,
      o: null,
      p: null,
      a: null,
      s: null,
      d: null,
      f: null,
      g: null,
      h: null,
      j: null,
      k: null,
      l: null,
      z: null,
      x: null,
      c: null,
      v: null,
      b: null,
      n: null,
      m: null,
    };
    this.styles = {
      row: ['row', 'flex', 'justify-center', 'items-center', 'gap-4'],
      cell: [
        'cell',
        'flex',
        'items-center',
        'justify-center',
        'border',
        'border-slate-700',
        'p-2',
        'text-slate-100',
        'h-16',
        'aspect-square',
        'text-2xl',
        'uppercase',
        'font-bold',
        'transition-colors',
      ],
      keyPad: [
        'key',
        'inline-block',
        'text-slate-50',
        'p-4',
        'rounded',
        'text-xl',
        'bg-gray-400',
        'cursor-pointer',
      ],
      modal: [
        'fixed',
        'top-1/4',
        'left-1/2',
        '-translate-x-1/2',
        '-translate-y-1/2',
        'w-max',
        'text-slate-900',
        'p-4',
        'rounded',
        'text-lg',
        'font-semibold',
        'bg-gray-400',
        'opacity-0',
      ],
    };
  }
  startGame() {
    this.buildBoard();
    this.buildKeyPad();
    this.randomAWord();
    // let storageData = this.getFromStorage();

    // if (!storageData) {
    //   this.randomAWord();
    // } else {
    //   this.chosenWord = storageData.chosenWord;
    //   this.currentRowId = currentRowId;
    //   this.currentWord = currentWord;
    //   this.currentLetterId = currentLetterID;

    //   this.keys.forEach(key => {
    //     this.setBgColor(document.getElementById(key), key);
    //   });
    // }
    this.currentRow = [
      ...this.rows[this.currentRowId].querySelectorAll('.cell'),
    ];
    console.log(this.chosenWord);
  }
  buildBoard() {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < this.wordLength; i++) {
      const row = document.createElement('div');
      row.classList.add(...this.styles.row);
      for (let j = 0; j < this.wordLength; j++) {
        const cell = document.createElement('div');
        cell.classList.add(...this.styles.cell);
        row.appendChild(cell);
      }
      fragment.appendChild(row);
    }
    this.boardSection.appendChild(fragment);
    this.rows = this.boardSection.querySelectorAll('.row');
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
        const keyPad = document.createElement('button');
        keyPad.classList.add(...this.styles.keyPad);
        keyPad.setAttribute('id', key);
        keyPad.textContent = key;
        keyPad.onclick = e => {
          this.handleKeyPress(e.target.textContent);
        };
        keysRow.appendChild(keyPad);
      });
      fragment.appendChild(keysRow);
    });
    this.keyPadsSection.appendChild(fragment);
  }

  handleKeyPress(letter) {
    let cell;
    switch (letter) {
      case 'enter':
        if (this.currentWord.length < this.wordLength) return;
        let wordCheck = this.checkWord();
        if (!wordCheck) return;
        let status = this.tries[this.currentRowId][this.currentWord];
        this.currentRow.forEach((cell, id) => {
          this.setBgColor(cell, status[id]);
          this.keys[cell.textContent] = status[id];
        });
        this.updateKeys();
        if (this.currentRowId < this.wordLength) {
          this.currentRowId++;
          this.currentLetterId = 0;
          this.currentWord = '';
          this.currentRow = [
            ...this.rows[this.currentRowId].querySelectorAll('.cell'),
          ];
        }
        break;
      case 'delete':
        if (this.currentWord.length === 0) return;
        cell = this.currentRow[this.currentWord.length - 1];
        cell.textContent = '';
        this.currentWord = this.currentWord.split('').slice(0, -1).join('');
        break;
      default:
        if (this.currentWord.length === this.wordLength) return;
        cell = this.currentRow[this.currentWord.length];
        this.currentWord += letter;
        cell.textContent = letter;
        cell.animate({ transform: 'scale(1.2)' }, { duration: 200 });
        this.currentLetterId++;
    }
  }
  randomAWord() {
    this.chosenWord =
      this.wordList[Math.floor(Math.random() * this.wordList.length)];
  }
  updateKeys() {
    let keys = [...this.keyPadsSection.querySelectorAll('.key')];
    Object.keys(this.keys).forEach((key, id) => {
      this.setBgColor(keys[id], this.keys[key]);
    });
  }
  checkLetter(letter, id = null) {
    const indices = [];
    let idx = this.chosenWord.indexOf(letter);
    while (idx !== -1) {
      indices.push(idx);
      idx = this.chosenWord.indexOf(letter, idx + 1);
    }
    if (indices.length > 0) {
      if (indices.includes(id)) {
        return 'success';
      } else {
        return 'notInPlace';
      }
    } else {
      return 'wrong';
    }
  }
  checkWord() {
    const letters = this.currentWord.split('');
    if (!this.wordList.includes(this.currentWord)) {
      this.createAndAnimateModal();
      return null;
    } else {
      const lettersStatus = [];

      letters.forEach((letter, id) => {
        let status = this.checkLetter(letter, id);
        lettersStatus.push(status);
        this.keys[letter] = status;
      });
      const tryObj = { [this.currentWord]: lettersStatus };
      this.tries.push(tryObj);
    }
    return 'good to go';
  }
  setBgColor(element, status) {
    switch (status) {
      case 'success':
        element.classList.add('bg-green-400');
        break;
      case 'notInPlace':
        element.classList.add('bg-yellow-400');
        break;
      case 'wrong':
        element.classList.add('bg-slate-600');
        break;
      default:
        return;
    }
  }
  saveToStorage() {
    localStorage.setItem(
      'gameData',
      JSON.stringify({
        chosenWord: this.chosenWord,
        currentRowId: this.currentRowId,
        currentWord: this.currentWord,
        currentLetterID: this.currentLetterId,
      })
    );
  }
  getFromStorage() {
    return JSON.parse(localStorage.getItem('gameData'));
  }
  createAndAnimateModal() {
    this.rows[this.currentRowId].animate(
      [
        { transform: 'translateX(0px) ' },
        { transform: 'translateX(5px) ' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(0px)' },
        { transform: 'translateX(5px) ' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(0px)' },
      ],
      { duration: 300 }
    );
    const modal = document.createElement('div');
    modal.classList.add(...this.styles.modal);
    modal.textContent = 'not in the word list!';
    modal.setAttribute('role', 'dialog');
    modal.animate([{ opacity: 1 }], {
      duration: 300,
      fill: 'forwards',
    });
    document.body.appendChild(modal);
    setTimeout(() => {
      modal.animate([{ opacity: 0 }], {
        duration: 300,
        fill: 'forwards',
      });
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    }, 1500);
  }
}
const wordList = ['jazzy', 'close', 'world', 'hello', 'blaze', 'joker'];
const game = new Game(wordList, 5);
game.startGame();

// window.addEventListener('onbeforeunload', game.saveToStorage);
