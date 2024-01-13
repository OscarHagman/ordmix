import React, { useState, useEffect, useRef } from 'react';

type Props = {
  children: React.ReactNode;
};

const Draggable = ({ children }: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const divRef = useRef<HTMLDivElement>(null);

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
      y: e.clientY - position.y,
    });
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
  };

  return (
    <div
      ref={divRef}
      style={isMounted ? { position: 'absolute', left: `${position.x}px`, top: `${position.y}px`} : {}}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className="select-none cursor-grab active:cursor-grabbing">
      {children}
    </div>
  );
};

export default Draggable;
