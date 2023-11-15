
const getWords = async () => {
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {headers: {"x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",},});
    let gameWords = await res.json();
    let {dictionary} = gameWords;
    return {dictionary};
};

const createBoard = () => { 

    const grid = document.getElementById('game_board');
    for (let i = 0; i < 4; i++) {

        const row = document.createElement('div');
        row.classList.add('row');
        row.classList.add('justify-content-center');

        for (let j = 0; j < 4; j++) {

            const col = document.createElement('div');
            col.classList.add('col-auto');
            col.classList.add('p-0');
            const box = document.createElement('div');
            box.classList.add('box');
            box.classList.add('border');
            col.appendChild(box);
            row.appendChild(col);
        }
        grid.appendChild(row);
    }
    let firstBox = document.getElementsByClassName("box")[0]
    firstBox.classList.add("border-primary")
}
createBoard();

const selectWord = async () => {
    let {dictionary} = await getWords();
    let words = dictionary[Math.floor(Math.random() * dictionary.length)]
    return words
}

currentWord = selectWord()

let guessesLeft = 4

let nextBox = 0

document.getElementById("start").addEventListener("click", () => {

    if (document.getElementById("win-image")) {
        document.getElementById("win-image").remove()
    }

    let board = document.getElementById("game_board")
    while (board.firstChild) {
        board.removeChild(board.firstChild)
    }
    createBoard()
    hintElement.innerHTML = null
    nextBox = 0
    guessesLeft = 4
    currentWord = selectWord()
})



document.addEventListener("keyup", (e) => {

    if (guessesLeft === 0) {
        return
    
    }

    let keyPressed = String(e.key)
    if (nextBox !== 0 && keyPressed === "Backspace") {

        removeLetter()
        return
    }

    if (keyPressed === "Enter") {
        checkGuess()
        return
    }
    if (keyPressed.match(/^[a-zA-Z]$/)) {
        let letters = keyPressed.match(/[a-z]/gi)
        if (!letters || letters.length > 1) {
            return
        } else {
            addLetter(keyPressed)
        }
    }
})

const addLetter = (letter) => {
    if (nextBox === 4) {
        return
    }
    let row = document.getElementsByClassName("row")[4 - guessesLeft]
    let boxes = row.getElementsByClassName("box")
    
    letter = letter.toLowerCase()
    boxes[nextBox].innerHTML = letter;
    nextBox++;
    if (nextBox < 4) {

        boxes[nextBox].classList.add("border-primary")

    }

    boxes[nextBox - 1].classList.remove("border-primary")
    
}

const removeLetter = () => {
    let row = document.getElementsByClassName("row")[4 - guessesLeft]
    let boxes = row.getElementsByClassName("box")
    boxes[nextBox - 1].innerHTML = "";
    if (nextBox < 4) {
        boxes[nextBox].classList.remove("border-primary")
    }
    nextBox--;
    
    boxes[nextBox].classList.add("border-primary")
    
}

const checkGuess = async () => {

    if (nextBox !== 4) {
        window.alert("Finish the 4 letter word before submitting!!")
        return
    }
    let dictionary = await currentWord
    let word = dictionary["word"]
    word = word.toLowerCase()

    let row = document.getElementsByClassName("row")[4 - guessesLeft]
    let boxes = row.getElementsByClassName("box")
    let guess = ""
    let dx = {}
    for (let i = 0; i < word.length; i++) {
        let letter = word[i]
        if (dx[letter]) {
            dx[letter] += 1;
        } else {
            dx[letter] = 1;
        }
    }
    
    let rightLetter = {}
    for (let i = 0; i < word.length; i++) {
        let letter = word[i]

        rightLetter[letter] = 0;
    }
    
    for (let i = 0; i < 4; i++) {
        let letter = boxes[i].innerHTML

        guess += letter
        
        if (letter === word[i]) {
            boxes[i].style.backgroundColor = "green";
            boxes[i].style.color = "white";

            if (rightLetter[letter]) {
                rightLetter[letter] += 1;
            }
            else {
                rightLetter[letter] = 1;
            }
        } else {
            boxes[i].style.backgroundColor = "gray";
            boxes[i].style.color = "white";
        }}
        for (let i = 0; i < 4; i++) {
            let letter = boxes[i].innerHTML
            if (word.includes(letter) && letter !== word[i]) {
                if ((rightLetter[letter]) < dx[letter]) {
                    boxes[i].style.backgroundColor = "yellow"
                    boxes[i].style.color = "white"
                    rightLetter[letter] += 1;
                }
            }
    }
   
    if (guess === word) {
        const winner = document.createElement('img');
        winner.src = "congrats.gif";
        document.getElementById('game_board').innerHTML = "";
        document.getElementById('game_board').appendChild(winner);
        let Alert = `<div class="alert alert-success fade show text-center" role="alert"> You have guessed the word <span class="fw-bold">` + word.toUpperCase() + `</span> correctly!!</div>`
        document.getElementById('AlertPlaceholder').innerHTML = Alert
        return
    }
    for (let i = 0; i < 4; i++) {
        boxes[i].classList.remove("border-primary")
    }
    nextBox = 0
    guessesLeft--
    if (guessesLeft === 0) {
        alert("The right word was "+ word.toUpperCase())
        return
    }
    let nextRow = document.getElementsByClassName("row")[4 - guessesLeft]
    let nextBoxes = nextRow.getElementsByClassName("box")
    nextBoxes[0].classList.add("border-primary")
}


const dark = document.getElementById('darkMode');
dark.addEventListener('click', toggleDarkMode);

function toggleDarkMode() {
  const currentTheme = document.documentElement.getAttribute('data-bs-theme');
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-bs-theme', 'light');
  } else {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  }
}

const hintButton = document.getElementById('hintButton');
const hintElement = document.getElementById('hint');

hintButton.addEventListener('click', async () => {
  let dictionary = await currentWord
  let hint = dictionary["hint"]

  hintElement.innerHTML = `Hint: ${hint}`;
  hintElement.style.display = 'block';
});

function openInstructions() {
    document.getElementById("instructionsSidebar").style.right = "0";
  }