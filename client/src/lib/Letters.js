"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Letters = exports.Consonants = exports.Vowels = void 0;
exports.Vowels = [
    { letter: "a", points: 1, type: "vowel" },
    { letter: "e", points: 1, type: "vowel" },
    { letter: "i", points: 1, type: "vowel" },
    { letter: "o", points: 2, type: "vowel" },
    { letter: "u", points: 4, type: "vowel" },
    { letter: "y", points: 7, type: "vowel" },
    { letter: "å", points: 4, type: "vowel" },
    { letter: "ä", points: 4, type: "vowel" },
    { letter: "ö", points: 4, type: "vowel" },
];
exports.Consonants = [
    { letter: "b", points: 3, type: "consonant" },
    { letter: "c", points: 4, type: "consonant" },
    { letter: "d", points: 2, type: "consonant" },
    { letter: "f", points: 4, type: "consonant" },
    { letter: "g", points: 3, type: "consonant" },
    { letter: "h", points: 4, type: "consonant" },
    { letter: "j", points: 8, type: "consonant" },
    { letter: "k", points: 4, type: "consonant" },
    { letter: "l", points: 1, type: "consonant" },
    { letter: "m", points: 3, type: "consonant" },
    { letter: "n", points: 1, type: "consonant" },
    { letter: "p", points: 4, type: "consonant" },
    { letter: "q", points: 9, type: "consonant" },
    { letter: "r", points: 1, type: "consonant" },
    { letter: "s", points: 1, type: "consonant" },
    { letter: "t", points: 1, type: "consonant" },
    { letter: "v", points: 7, type: "consonant" },
    { letter: "x", points: 8, type: "consonant" },
    { letter: "z", points: 8, type: "consonant" },
];
exports.Letters = [...exports.Vowels, ...exports.Consonants];
