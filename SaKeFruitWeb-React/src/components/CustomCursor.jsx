import React, { useEffect, useRef } from 'react';
import '../assets/css/cursor.css';

const CustomCursor = () => {
  const cursorDot = useRef(null);
  const cursorOutline = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      if (cursorDot.current) {
        cursorDot.current.style.left = `${posX}px`;
        cursorDot.current.style.top = `${posY}px`;
      }
      
      if (cursorOutline.current) {
        cursorOutline.current.animate({
          left: `${posX}px`,
          top: `${posY}px`
        }, { duration: 400, fill: "forwards", easing: "ease-out" });
      }
    };

    const handleMouseOver = (e) => {
      // If hovering over clickable elements, make cursor outline bigger
      if (e.target.closest('a, button, input, .product-card, .feature-card, .category-card')) {
        cursorOutline.current?.classList.add('cursor-hover');
      } else {
        cursorOutline.current?.classList.remove('cursor-hover');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={cursorDot}></div>
      <div className="cursor-outline" ref={cursorOutline}></div>
    </>
  );
};

export default CustomCursor;
