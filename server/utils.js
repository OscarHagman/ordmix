"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomLetters = void 0;
const Letters_1 = require("../client/src/lib/Letters");
const getRandomLetters = (numOfLetters) => {
    const randomLetters = [];
    for (let i = 0; i < numOfLetters; i++) {
        const randomIndex = Math.floor(Math.random() * Letters_1.Letters.length);
        const randomLetter = Letters_1.Letters[randomIndex];
        randomLetters.push(randomLetter);
    }
    return randomLetters;
};
const lettersHasAtLeastThreeVowels = (letters) => {
    let numOfVowels = 0;
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        if (letter.type === "vowel")
            numOfVowels++;
    }
    return numOfVowels >= 3;
};
const generateRandomLetters = () => {
    while (true) {
        const randomLetters = getRandomLetters(12);
        if (lettersHasAtLeastThreeVowels(randomLetters)) {
            return randomLetters;
        }
    }
};
exports.generateRandomLetters = generateRandomLetters;
