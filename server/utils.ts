import { Letters, LettersType } from "../client/src/lib/Letters"

const getRandomLetters = (numOfLetters: number) => {
  const randomLetters: LettersType[] = []

  for (let i = 0; i < numOfLetters; i++) {
    const randomIndex = Math.floor(Math.random() * Letters.length)
    const randomLetter = Letters[randomIndex]
    randomLetters.push(randomLetter)
  }

  return randomLetters
}

const lettersHasAtLeastThreeVowels = (letters: LettersType[]) => {
  let numOfVowels = 0

  for (let i = 0; i < letters.length; i++) {
    const letter = letters[i];
    if (letter.type === "vowel") numOfVowels++
  }

  return numOfVowels >= 3
}

export const generateRandomLetters = () => {
  while (true) {
    const randomLetters = getRandomLetters(12)
    if (lettersHasAtLeastThreeVowels(randomLetters)) {
      return randomLetters
    }
  }
}