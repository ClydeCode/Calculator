const display = document.querySelector('.display-text');
const displayHistory = document.querySelector('.display-history');

const numbers = document.querySelectorAll('.numbers');
const operators = document.querySelectorAll('.operators');
const clear = document.querySelector('.clear-button');
const calculate = document.querySelector('.calculate');

class Calculator {
    constructor () {
        this.firstNumber = '0';
        this.secondNumber = '';
        this.operator = '';
        this.history = '';
        this.updateDisplay();
    }

    clearEverything () {
        this.firstNumber = '0';
        this.secondNumber = '';
        this.operator = '';
        this.history = '';
        this.updateDisplay('');
    }

    clearForTheNext () {
        this.secondNumber = '';
        this.operator = '';
        this.updateDisplay('');
    }

    pushToHistory () {
        if (this.history)
            return this.history += ' ' + this.operator + ' ' + this.secondNumber; 
        this.history += this.firstNumber + ' ' + this.operator + ' ' + this.secondNumber;
    }

    appendNumber (number) {
        if (this.firstNumber === '0') return this.firstNumber = number;
        if (this.operator) return this.secondNumber += number;
        this.firstNumber += number;
    }

    chooseOperator (operator) {
        if (this.firstNumber > 0)
            return this.operator = operator;
    }

    updateDisplay () {
        let text = this.firstNumber + ' ' + this.operator + ' ' + this.secondNumber;
        if (text.length > 18) return;
        display.textContent = text;
        displayHistory.textContent = this.history;
    }

    operate () {
        if (this.firstNumber === '0' && this.operator == '/' || this.secondNumber === '0' && this.operator == '/')
            return this.firstNumber = this.error();
        switch(this.operator) {
            case '+':
                return this.firstNumber = this.scientificNotation(this.round(this.add(this.firstNumber, this.secondNumber)));
            case '-':
                return this.firstNumber = this.scientificNotation(this.round(this.subtract(this.firstNumber, this.secondNumber)));
            case '*':
                return this.firstNumber = this.scientificNotation(this.round(this.multiply(this.firstNumber, this.secondNumber)));
            case '/':
                return this.firstNumber = this.scientificNotation(this.round(this.divide(this.firstNumber, this.secondNumber)));
            case '%':
                return this.firstNumber = this.round(this.percentages(this.firstNumber, this.secondNumber));
        }
    }

    round (number) {
        const numStr = String(number);
        if (numStr.includes('.')) {
            if (numStr.split('.')[1].length > 2) {
            const m = Number((Math.abs(number) * 100).toPrecision(15));
            return parseFloat(Math.round(m) / 100 * Math.sign(number));
            }
        };
        return number;
    }

    scientificNotation (number) {
        let numbers = String(number);
        if (numbers.length > 10) return Number(numbers).toExponential(2);
        return number;
    }

    error () {
        return "ERROR";
    }

    checkValues () {
        return this.firstNumber && this.secondNumber && this.operator;
    }
    
    add (firstNumber, secondNumber) {
        return +firstNumber + +secondNumber;
    }
    subtract (firstNumber, secondNumber) {
        return firstNumber - secondNumber;
    }
    multiply (firstNumber, secondNumber) {
        return firstNumber * secondNumber;
    }
    divide (firstNumber, secondNumber) {
        return firstNumber / secondNumber;
    }
    percentages (firstNumber, secondNumber) {
        if (firstNumber >= secondNumber)
            return (100 * firstNumber) / secondNumber;
        return (100 * secondNumber) / firstNumber;
    }
}

const calculator = new Calculator();

numbers.forEach(number => {
    number.addEventListener('click', () => {
        calculator.appendNumber(number.id);
        calculator.updateDisplay();
    })
})

operators.forEach(operator => {
    operator.addEventListener('click', () => {
        if (calculator.checkValues()) {
            calculator.pushToHistory();
            calculator.operate();
            calculator.chooseOperator(operator.id);
            calculator.clearForTheNext();
        }
        calculator.chooseOperator(operator.id);
        calculator.updateDisplay();
    })
});

clear.addEventListener('click', () => {
    calculator.clearEverything();
})

calculate.addEventListener('click', () => {
    if (!calculator.checkValues()) return;
    calculator.pushToHistory();
    calculator.operate();
    calculator.clearForTheNext();
    calculator.updateDisplay();
})