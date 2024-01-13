import React, { useState } from 'react'
import { LettersType } from '@/lib/Letters'

type Cell = {
  letter: LettersType | null
}

const generateInitialGrid = () => {
  const grid: Cell[][] = []

  for (let i = 0; i < 15; i++) {
    const row: Cell[] = []
    for (let j = 0; j < 15; j++) {
      row.push({ letter: null })
    }
    grid.push(row)
  }

  return grid
}

const PlayArea = () => {
  const [grid, setGrid] = useState<Cell[][]>(generateInitialGrid())

  return (
    <div className='border border-slate-600/40'>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className='flex'>
          {row.map((cell, cellIndex) => (
            <div key={cellIndex} className='border border-slate-600/40 w-12 h-12' />
          ))}
        </div>
      ))}
    </div>
  )
}

export default PlayArea
