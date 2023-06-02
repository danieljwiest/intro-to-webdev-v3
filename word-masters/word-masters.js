
///it would be nice to incorporate a preventDefault earlier to keep things from happening when people hold down keys and such

let guessNum = 1;
let letterNum = 0;
let currentGuess = "";
let codeWord = "";
let currentPosition;
let isDone = false;
let isLoading = false;
const TRANSITION_DELAY = 400;
const TOTAL_NUM_OF_GUESSES = 6;
const WORD_LENGTH = 5;

async function init() {
    //Get Code Word
    codeWord = await getCodeWord();

    //Listen for key Events and process accordingly
    document
        .addEventListener("keydown", function(event) {
        if(isDone || isLoading) {
            //do nothing
            return
        }
        keyStroke(event);
    });
}

//Request daily word from API
async function getCodeWord () {
    isLoading= true;
    setLoading(isLoading)
    const res = await fetch("https://words.dev-apis.com/word-of-the-day")
    const {word: dailyWord } = await res.json();
    isLoading = false
    setLoading(false)
    return dailyWord.toUpperCase()
}

//function to toggle loading symbol
function setLoading(isLoading) {
    const loadingSymbol = document.querySelector('.loading-symbol')

    loadingSymbol.classList.toggle("hidden", !isLoading)
}

//Route keyStrokeEvents to proper handlers.
function keyStroke(event) {
    if (isLetter(event.key)) {
        handleLetter(event.key);
    } else {
        handleSymbol(event.key);
    }
}

//Check if keystroke was a letter or not
function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}


function handleLetter (letter) {
    if (currentGuess.length < 5 ){
        letter = letter.toUpperCase();
        setCurrentPosition(guessNum, currentGuess.length+1)
        //Assign key to both front and back of card.
        for(const item of currentPosition.children) {
            item.innerHTML = letter
        }
        currentGuess += letter;
    } else {
        //Do nothing if current guess already has 5 letters
        return;
    }
}

function handleSymbol (symbol)  {
    switch (symbol) {
        case "Backspace":
            backspace();
            break;
        case "Enter":
            if (currentGuess.length === WORD_LENGTH) {
                submitGuess();
            } else {
                //Do nothing if guess is not a 5-letter word
                return;
            }
            break;        
    }  
}  


function setCurrentPosition(row, column) {
    currentPosition = document.querySelector(
        `.display-row:nth-child(${row}) 
        .display-cell:nth-child(${column}) 
        .flip-card-inner`
        )
}

function backspace() {
    if(!currentPosition) {
        //Do Nothing
        console.log("no current Position")
    } else {
        for(const item of currentPosition.children) {
            item.innerHTML = ""
        }
        const row = guessNum;
        const column = currentGuess.length - 1;
        setCurrentPosition(row, column)
        currentGuess = currentGuess.slice(0,-1)
    }
}

async function submitGuess() {
    //Validate if guess is a real word
    const res = await fetch("https://words.dev-apis.com/validate-word", {
        method: "POST", 
        body: JSON.stringify({word: currentGuess})
    })

    const {validWord} = await res.json();

    //If non-valid word apply a "shake" animation to all the letters and then return
    if(!validWord) {
        const currentRow = document.querySelector(`.display-row:nth-child(${guessNum})`)
        currentRow.classList.add("shake")
        setTimeout(()=>{
            currentRow.classList.remove("shake")
        }, 600)
        return;
    }

    //Find Matches and check if guess is correct
    const matches = findMatches();
    const guessFormat = determineGuessFormat(matches);
    setGuessFormat(guessFormat);
    if (validateGuess() === true) {
        //Display Win state after Guess Formatting is complete
        setTimeout(()=>{alert("you win")}, codeWord.length * TRANSITION_DELAY)
        isDone = true;
    } else if(guessNum === TOTAL_NUM_OF_GUESSES ) {
        setTimeout(()=>{alert(`You Lost, the correct word was ${codeWord}`)}, codeWord.length * TRANSITION_DELAY)
        isDone = true;
    }
    guessNum ++;
    currentGuess = [];
}

//Function loops over currentGuess and CodeWord checking for matches. Matched letters and match coutn are logged in an object
function findMatches() {
    const matches = {};
    for (let i = 0; i < currentGuess.length; i++) {
        const letter = currentGuess[i];
        if( !matches[letter] ) {
        //if the letter has not already been matched then search for matches otherwise move to next letter;
            for (let j = 0; j < codeWord.length; j++) {
                if(letter === codeWord[j]) {
                    matches[letter] = (matches[letter] || 0) + 1;
                }
            }
        }
    }
    return (matches)
}

//function to check if current guess is correct
function validateGuess() {
    if (currentGuess === codeWord) {
        return true;
    } else {
        return false;
    }
}


//Function to determine formatting for each letter in guess. Returns an array with resulting css class
function determineGuessFormat(matches) {
    //array to store required letter format
    const results = ['no-match','no-match','no-match','no-match','no-match']
    //First loop through looking for exact matches
    for (let i = 0; i < currentGuess.length; i++ ) {
        const letter = currentGuess[i];
        if(letter === codeWord[i]) {
            results[i] = 'exact-match';
            matches[letter] -= 1;
        }
    }
    //Second loop through formatting partial matches
    for (let i = 0; i < currentGuess.length; i++ ) {
        const letter = currentGuess[i];
        if(matches[letter] > 0) {
            results[i] = 'partial-match';
            matches[letter] -= 1;
        } 
    }
    return results;
}

//Apply formatting from the determineGuessFormat function
function setGuessFormat(guessFormat) {
    for (let i = 0; i < currentGuess.length; i++) {
        const currentCell = document.querySelector(`.display-row:nth-child(${guessNum}) .display-cell:nth-child(${i+1})`)

        setTimeout(()=>{
            currentCell.classList.add(guessFormat[i], 'checked')
        }, i * TRANSITION_DELAY)
    }
}






init();