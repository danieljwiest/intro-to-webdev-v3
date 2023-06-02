const button = document.querySelector(".keypad");
const display = document.querySelector(".display");

let btnClass;
let currentInput = "0";
let currentSum = "0";
let operator;
let result;



//need to figure out why equals does not work

button.addEventListener("click", function(event) {
    btnClass = event.target.className
    console.log(currentInput, currentSum, operator)

    if (btnClass.includes("operator")) {
        if(operator === undefined) {
            console.log("operator = zero if statement",currentSum)
            display.innerText = "0";

            if (currentSum === "0") {
                currentSum = currentInput;
                currentInput = "0";
            }
 
            console.log("after currentsum 0 if statement",currentSum)
            if (btnClass.includes("plusBtn")) {
                operator = "plus";
            } else if(btnClass.includes("minusBtn")) {
                operator = "minus";
            } else if(btnClass.includes("multBtn")) {
                operator = "times";
            } else if(btnClass.includes("divBtn")) {
                operator = "divide";
            }
        } else if(btnClass.includes("equalBtn")){
            result = evaluate(currentSum, currentInput);
            display.innerText = result;
            currentSum = result.toString();
            currentInput = "0"
            console.log(currentSum)
            operator = undefined;
        } else {console.log("you hit the else")}
    } else if(btnClass.includes("clrBtn")) {
        clear();
    } else if(btnClass.includes("bckBtn")) {
        bckBtn();
    } else if (btnClass.includes("btn0") && currentInput === "0") {
        return;
    } else {
        if (currentInput === "0") {
            currentInput = event.target.innerText
        } else {
        currentInput = currentInput + event.target.innerText;
        }
        display.innerHTML = currentInput;
    }

    console.log(currentInput, currentSum, operator)
});


function clear() {
    display.innerText = 0;
    currentInput = "0";
    currentSum = "0";
    operator = undefined;

}

function bckBtn() {
    currentInput = currentInput.substring(0,currentInput.length-1);
    if (currentInput.length === 0) {
        currentInput = "0";
    }
    display.innerHTML = currentInput;
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
    return num1 / num2;
}
function evaluate(numString1, numString2) {
    num1 = parseInt(numString1);
    num2 = parseInt(numString2);

    if (operator === "plus") {
        return add(num1, num2);
    } else if(operator === "minus") {
        return subtract(num1, num2);
    } else if(operator === "times") {
        return multiply(num1, num2);
    } else if(operator === "divide") {
        return divide(num1, num2);
    }

}
