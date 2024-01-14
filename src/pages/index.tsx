import { useState } from 'react'
import { Inter } from 'next/font/google'
import { Letters, LettersType } from '@/lib/Letters'
import Letter from '@/components/Letter'
import PlayArea from '@/components/PlayArea'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [letters, setLetters] = useState<LettersType[]>([])

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

  const handleStartGame = () => {
    while (true) {
      const randomLetters = getRandomLetters(12)
      if (lettersHasAtLeastThreeVowels(randomLetters)) {
        setLetters(randomLetters)
        break
      }
    }
  }
  
  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-6 ${inter.className}`}>
      {letters.length === 0 &&
        <button onClick={handleStartGame} className='rounded px-4 py-2 border border-slate-300 hover:bg-slate-800 transition-all duration-200'>
          Start game
        </button>}

      {letters.length > 0 && <PlayArea letters={letters} />}
    </main>
  )
}
