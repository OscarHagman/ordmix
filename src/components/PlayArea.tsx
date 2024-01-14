import React, { useState, useEffect, useRef } from 'react'
import { LettersType } from '@/lib/Letters'
import type { OnMouseUpData } from './Draggable'
import Letter from './Letter'

type Cell = {
  letter: LettersType | null
  ref: React.RefObject<HTMLDivElement>
  centerPosition: {
    x: number
    y: number
  }
}

export type LetterSnapPosition = {
  position: {
    x: number
    y: number
  }
  index: number
  hasSnapped: boolean
  gridPosition?: {
    row: number
    column: number
  }
}

const generateInitialGrid = () => {
  const grid: Cell[][] = []

  for (let i = 0; i < 15; i++) {
    const row: Cell[] = []
    for (let j = 0; j < 15; j++) {
      const divRef = useRef<HTMLDivElement>(null)
      row.push({ letter: null, ref: divRef, centerPosition: { x: 0, y: 0 } })
    }
    grid.push(row)
  }

  return grid
}

const getCellCenterPosition = (cell: Cell) => {
  if (!cell.ref.current) throw new Error('Cell ref is not defined')

  const x = cell.ref.current.offsetLeft
  const y = cell.ref.current.offsetTop

  const width = cell.ref.current.offsetWidth
  const height = cell.ref.current.offsetHeight

  const centerX = x + width / 2
  const centerY = y + height / 2

  return { x: centerX, y: centerY }
}

const generateLettersInitialSnapPositions = (letters: LettersType[]) => {
  const lettersSnapPositions: LetterSnapPosition[] = []

  for (let i = 0; i < letters.length; i++) {
    lettersSnapPositions.push({ position: { x: 0, y: 0 }, index: i, hasSnapped: false })
  }

  return lettersSnapPositions
}


type Props = {
  letters: LettersType[]
}

const PlayArea = ({ letters }: Props) => {
  const [grid, setGrid] = useState<Cell[][]>(generateInitialGrid())
  const [lettersSnapPositions, setLettersSnapPositions] = useState<LetterSnapPosition[]>(generateLettersInitialSnapPositions(letters))

  const playAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updatedGrid: Cell[][] = []

    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];
      const updatedRow: Cell[] = []

      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        const updatedCell = { ...cell, centerPosition: getCellCenterPosition(cell) }
        updatedRow.push(updatedCell)
      }

      updatedGrid.push(updatedRow)
    }

    setGrid(updatedGrid)
  }, [])

  const calculateClosestCell = (position: { x: number; y: number }) => {
    let closestCell: Cell | null = null
    let closestDistance: number | null = null
    let closestCellIndexes: { row: number; column: number } | null = null

    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        const distance = Math.sqrt((cell.centerPosition.x - position.x) ** 2 + (cell.centerPosition.y - position.y) ** 2)

        if (!closestDistance || distance < closestDistance) {
          closestCell = cell
          closestDistance = distance
          closestCellIndexes = { row: i, column: j }
        }
      }
    }

    return { cell: closestCell, indexes: closestCellIndexes }
  }

  const isOverlapping = (elem1: HTMLElement, elem2: HTMLElement) => {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();

    return !(
        rect1.top > rect2.bottom ||
        rect1.right < rect2.left ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right
    );
  }

  const clearPreviousGridPosition = (previousGridPosition: { row: number, column: number }) => {
    const updatedGrid = [...grid]
    updatedGrid[previousGridPosition.row][previousGridPosition.column].letter = null
    setGrid(updatedGrid)
  }

  const handleLetterPosition = (data: OnMouseUpData, index: number) => {
    if (playAreaRef.current) {
      const isOverlappingPlayArea = isOverlapping(data.divRef.current!, playAreaRef.current)
      if (!isOverlappingPlayArea) {
        const updatedLetterSnapPosition = [...lettersSnapPositions][index]
        if (updatedLetterSnapPosition.gridPosition) clearPreviousGridPosition(updatedLetterSnapPosition.gridPosition)
        
        return
      }
    }

    const updatedLettersSnapPositions = [...lettersSnapPositions]
    const updatedLetterSnapPosition = updatedLettersSnapPositions[index]
    const updatedGrid = [...grid]
    const closestCell  = calculateClosestCell(data.centerPosition)

    if (closestCell.cell !== null && closestCell.indexes !== null) {

      if (closestCell.cell.letter === null) {
        // Remove letter from previous grid cell
        if (updatedLetterSnapPosition.gridPosition !== undefined) {
          const previousGridPosition = updatedLetterSnapPosition.gridPosition
          clearPreviousGridPosition(previousGridPosition)
        }

        // Add letter to grid
        updatedGrid[closestCell.indexes.row][closestCell.indexes.column].letter = letters[index]

        // Update letter snap position
        updatedLettersSnapPositions[index] = {
          position: closestCell.cell.centerPosition,
          index, hasSnapped: true,
          gridPosition: { row: closestCell.indexes.row, column: closestCell.indexes.column }
        }

        setGrid(updatedGrid)
        setLettersSnapPositions(updatedLettersSnapPositions)
      }

      else {
        // If cell is occupied, move letter back to previous position
        updatedLettersSnapPositions[index] = { position: data.previousPosition, index, hasSnapped: true }
        setLettersSnapPositions(updatedLettersSnapPositions)
      }
    }
  }

  const handleLetterMouseDown = (index: number) => {
    const updatedLettersSnapPositions = [...lettersSnapPositions]
    const updatedLetterSnapPosition = { ...updatedLettersSnapPositions[index], hasSnapped: false}

    updatedLettersSnapPositions[index] = updatedLetterSnapPosition
    setLettersSnapPositions(updatedLettersSnapPositions)
  }

  return (
    <>
      <div ref={playAreaRef} className='border border-slate-600/40'>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className='flex'>
            {row.map((cell, cellIndex) => (
              <div ref={cell.ref} key={cellIndex} className='border border-slate-600/40 w-12 h-12' />
              ))}
          </div>
        ))}
      </div>

      <div className='flex flex-wrap gap-4'>
        {letters.map((letter, index) => (
          <Letter
            getDataOnMouseUp={(data) => handleLetterPosition(data, index)}
            onMouseDown={() => handleLetterMouseDown(index)}
            index={index}
            snap={lettersSnapPositions[index]}
            key={index}
            letter={letter}
          />
        ))}
      </div>
    </>
  )
}

export default PlayArea
