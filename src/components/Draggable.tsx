import React, { useState, useEffect, useRef } from 'react';
import { LetterSnapPosition } from './PlayArea';

export type OnMouseUpData = {
  centerPosition: { x: number; y: number };
  previousPosition: { x: number; y: number };
  dimensions: { width: number; height: number };
  divRef: React.RefObject<HTMLDivElement>;
}

type Props = {
  children: React.ReactNode;
  getDataOnMouseUp?: (data: OnMouseUpData) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  snap?: LetterSnapPosition
};

const Draggable = ({ children, getDataOnMouseUp, onMouseDown, snap }: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [previousCenterPosition, setPreviousCenterPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const divRef = useRef<HTMLDivElement>(null);

  const getCenterPosition = () => {
    const centerX = position.x + divRef.current!.offsetWidth / 2;
    const centerY = position.y + divRef.current!.offsetHeight / 2;
    return { x: centerX, y: centerY };
  }

  const getDimenstions = () => {
    const width = divRef.current!.offsetWidth;
    const height = divRef.current!.offsetHeight;
    return { width, height };
  }

  useEffect(() => {
    if (snap?.hasSnapped) {
      const snapCenterPositionX = snap.position.x - divRef.current!.offsetWidth / 2;
      const snapCenterPositionY = snap.position.y - divRef.current!.offsetHeight / 2;
      setPosition({ x: snapCenterPositionX, y: snapCenterPositionY });
    }
  }, [snap?.hasSnapped])

  useEffect(() => {
    if (divRef.current) {
      const x = divRef.current.offsetLeft;
      const y = divRef.current.offsetTop;

      setPosition({ x, y });
      setIsMounted(true);
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });

    const centerPosition = getCenterPosition();

    setPreviousCenterPosition({
      x: centerPosition.x,
      y: centerPosition.y
    });

    if (onMouseDown) onMouseDown(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    if (getDataOnMouseUp) {
      const centerPosition = getCenterPosition();
      const dimensions = getDimenstions();
      getDataOnMouseUp({
        centerPosition,
        dimensions,
        divRef,
        previousPosition: previousCenterPosition
      });
    }
  };

  return (
    <div
      ref={divRef}
      style={isMounted ? { position: 'absolute', left: `${position.x}px`, top: `${position.y}px`} : {}}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className="select-none cursor-grab active:cursor-grabbing active:z-50">
      {children}
    </div>
  );
};

export default Draggable;
