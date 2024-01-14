import { useState, useEffect } from 'react'
import { Inter } from 'next/font/google'
import { LettersType } from '@/lib/Letters'
import socket from '@/lib/socketIo'
import PlayArea from '@/components/PlayArea'

const inter = Inter({ subsets: ['latin'] })

export type MovingLetter = {
  x: number
  y: number
  index: number
}

export default function Multiplayer() {
  const [letters, setLetters] = useState<LettersType[]>([])
  const [movingLetter, setMovingLetter] = useState<MovingLetter | null>(null)
  const gameId = "game-room"

  useEffect(() => {
    const handleStartGame = (letters: LettersType[]) => {
      console.log("starting game")
      setLetters(letters)
    }

    const handleMovingLetter = (letter: MovingLetter) => {
      console.log("position:", letter.x, letter.y)
      setMovingLetter(letter)
    }

    socket.emit("joinGame", gameId);
    socket.on("startGame", handleStartGame);
    socket.on("movingLetter", handleMovingLetter);

    // Cleanup the event listener
    return () => {
      socket.off("startGame", handleStartGame);
      socket.off("movingLetter", handleMovingLetter);
    };
  }, [])

  const handleGetLetterCurrentPosition = (letter: MovingLetter) => {
    console.log('letter:', letter)
    socket.emit("movingLetter", gameId, letter)
  }
  
  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-6 ${inter.className}`}>
      <button onClick={() => socket.emit("startGame", gameId)} className='px-4 py-2 rounded border border-slate-300'>start game</button>
      {letters.length > 0 && <PlayArea letters={letters} getLetterCurrentPosition={handleGetLetterCurrentPosition} movingLetter={movingLetter} />}
    </main>
  )
}
