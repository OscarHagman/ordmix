import React, { useEffect, useState, useRef } from 'react'
import type { LettersType } from '@/lib/Letters'
import Draggable from './Draggable'

type Props = {
  letter: LettersType
}

const Letter = ({ letter }: Props) => {
  const [fillerDivWidth, setFillerDivWidth] = useState<string>("0px")

  const pointsDivRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (pointsDivRef.current) {
      const letterDivWidth = pointsDivRef.current.clientWidth
      setFillerDivWidth(`${letterDivWidth}px`)
    }
  }, [])

  return (
    <Draggable>
      <div
        className="
          rounded bg-slate-100 p-0.5 w-11 h-11 flex items-center justify-between
        ">
        <div style={{ width: fillerDivWidth }} className='pl-1.5' />
        <div className="flex">
          <h1 className='uppercase text-slate-900 font-semibold text-3xl'>{letter.letter}</h1>
        </div>
        <div ref={pointsDivRef} className="flex pt-6">
          <h2 className='text-slate-900 text-sm'>{letter.points}</h2>
        </div>
      </div>
    </Draggable>
  )
}

export default Letter