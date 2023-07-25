//Caclulator Handles
const button = document.querySelector(".keypad");
const display = document.querySelector(".display");


//Program State
let currentNum = "";
let currentSum = "";
let currentOperator = "";
let prevResult = undefined; //value to store result after an equalsButton. Used to enable user to perform operations on previous result.


//Listen for user input "click" or keyboard entry and pass to inputHandler
button.addEventListener("click", function(event) {
    //Register user click on calculator keypad and pass input inputHandler.
    const input = event.target.innerHTML
    handleInput(input);
    return input;
})

document.addEventListener("keydown", function(event) {
    event.preventDefault();
    //Register user keypress and pass input to inputHandler
    const input = event.key
    handleInput(input);
})

//Function to parse input and route to correct handler functions
function handleInput(input) {
const isNumRegex = /^[0-9]$/;
const isOperatorRegex = /[+−÷×/*-]/;
console.log(input)

    switch (true) {
        case isNumRegex.test(input):
            handleNumber(input);
            break;
        case isOperatorRegex.test(input):
            handleOperator(input);
            break;
        case input === "Backspace" || input === "←":
            handleBackspace();
            break;
        case input === "C" || input === "c":
            clearCalculator();
            break;
        case input === "Enter" || input === "=":
            handleEqualsBtn();
            break;
        default:
            console.log("invalid input")
            //Do nothing. Invalid input
    } 
}



function handleNumber(number) {
    if(currentNum === "0" || currentNum ==="") {
        //replace "0" with first number of new number string
        setCurrentNum(number);
    } else {
        //amend current number string.
        const newNum = currentNum + number;
        setCurrentNum(newNum);
    }
    setDisplayValue(currentNum);
}


function handleOperator(input) {
    switch (true) {
        case (currentNum === "0" || currentNum === "") && currentSum === "":
            //If operator entered with no currentNum or currentSum. Set prevResult to currentSum and operate on it. This enables users to operate on prev results after pressing "=".
            if(prevResult === undefined) break; //When there is no previous result then do nothing.
            setCurrentSum(prevResult);
            setCurrentOperator(input);
            break;    
        case currentSum === "" && currentOperator === "" && currentNum !== "":
            // If no currentSum but have a currentNum: Update Sum, clear Num, set currentOperator
            setCurrentSum(currentNum);
            setCurrentOperator(input);
            setCurrentNum("");
            setDisplayValue("");
            break;
        case currentNum === "" && currentOperator !== "":
            //Update operator to most recent input
            setCurrentOperator(input);
            break;
        case currentNum !== "" && currentOperator !== "":
            //evaluate previous operation, update state, log current operator
            const result = evaluate(currentSum, currentNum, currentOperator);
            setCurrentSum(result);
            setCurrentNum("");
            setCurrentOperator(input);
            setDisplayValue(currentSum);
            break;
        default:
            throw new Error(`Handle Operator Failed. Input was: ${input}, currentSum: ${currentSum}, currentNum: ${currentNum}, currentOperator: ${currentOperator}`)
    }
}

function handleBackspace() {
    const newNum = "";
    //If currentNum is more then one digit then remove last digit and assign to newNum
    if (currentNum.length > 1) {
        newNum = currentNum.slice(0,-1)
    }
    setDisplayValue(currentNum);
}

function clearCalculator() {
    //Reset state to initial values
    setCurrentNum("");
    setCurrentSum("");
    setCurrentOperator("");
    setDisplayValue("");
    setPrevResult(undefined);
}

function handleEqualsBtn() {
    let result = "Error"; 

    if(!currentNum && !currentSum) {
        //if equals is entered as first input then do nothing
        return;
    }

    if(currentNum !== "" && currentSum === ""){
        //Catch if someone enters a number and presses "=" before performing an operation. Return current number.
        result = currentNum;
    } else if (currentNum === "" && currentSum !== "") {
        //catch if someone presses "=" after entering an operation and not entering a second number. Just return the currentSum and ignore the operation entered.
        result =  currentSum;
    } else {
        //Evaluate current operation
        result = evaluate(currentSum, currentNum, currentOperator);
    }
    //Set Display to currentSum and reset state.
    setDisplayValue(result);
    setCurrentSum("");
    setCurrentNum("");
    setCurrentOperator("");
    setPrevResult(result);
}


function evaluate(numString1, numString2, operator) {
    num1 = parseInt(numString1);
    num2 = parseInt(numString2);
    switch (operator) {
        case "+":
            return add(num1, num2);
        case "−":
        case "-":
            return subtract(num1, num2);
        case "*":
        case "×":
            return multiply(num1, num2);
        case "/":
        case "÷":
            return divide(num1, num2);
    }
}

function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2){
    return num1 * num2;
}

function divide(num1, num2) {
    const num = num1 / num2;
    return num1 / num2;
}

function setCurrentNum(number) {
    currentNum = number;
}

function setCurrentSum(number) {
    currentSum = number;
}

function setCurrentOperator(operator) {
    currentOperator = operator;
}

function setDisplayValue(value) {
    display.innerText = value;
}

function setPrevResult(value) {
    prevResult = value;
}
