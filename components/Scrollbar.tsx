/* eslint-disable react-hooks/exhaustive-deps */
import type { NextPage } from "next";
import React, { useState, useCallback, useEffect, useRef } from "react";
import styles from "@/styles/components/Scrollbar.module.scss";

const SCROLL_BOX_MIN_HEIGHT = 20;

type Props = {
  children?: React.ReactNode;
};

const CustomScrollBar: NextPage<Props> = ({children}: Props) => {
  const [hovering, setHovering] = useState<boolean>(false);
  const [scrollBoxHeight, setScrollBoxHeight] = useState<number>(SCROLL_BOX_MIN_HEIGHT);
  const [scrollBoxTop, setScrollBoxTop] = useState<number>(0);
  const [lastScrollThumbPosition, setScrollThumbPosition] = useState<number>(0);
  const [isDragging, setDragging] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  let timeout: NodeJS.Timeout | undefined = undefined;

  const ref = useRef<any>();
  const thumb = useRef<any>();

  const handleMouseOver = useCallback(() => {
    setHovering(true);
    thumb.current.addEventListener("mousemove", (e: { clientX: number; clientY: number; }) => {
      const { x, y } = thumb.current.getBoundingClientRect();
      thumb.current.style.setProperty("--x", e.clientX - x);
      thumb.current.style.setProperty("--y", e.clientY - y);
    })
    return function cleanup() {
      thumb.current.removeEventListener("mousemove", () => {});
    };
  }, []);

  const handleMouseOut = useCallback(() => {
    setHovering(false);
    setShow(true);
    
    timeOut()
    thumb.current.removeEventListener("mousemove", () => {});
  }, []);

  const handleDocumentMouseUp = useCallback((e: { preventDefault: () => void; }) => {
      if (isDragging) {
        e.preventDefault();
        setDragging(false);
      }
    },
    [isDragging]
  );

  const handleDocumentMouseMove = useCallback((e: { preventDefault: () => void; stopPropagation: () => void; clientY: number; }) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        const scrollHostElement = document.body;
        const { scrollHeight } = scrollHostElement;
        const offsetHeight = window.innerHeight

        let deltaY = e.clientY - lastScrollThumbPosition;
        let percentage = deltaY * (scrollHeight / offsetHeight);

        setScrollThumbPosition(e.clientY);
        setScrollBoxTop(
          Math.min(
            Math.max(0, scrollBoxTop + deltaY),
            offsetHeight - scrollBoxHeight
          )
        );
        if (!document.scrollingElement) return
        document.scrollingElement.scrollTop = Math.min(
          document.scrollingElement.scrollTop + percentage,
          scrollHeight - offsetHeight
        );
      }
    },
    [isDragging, lastScrollThumbPosition, scrollBoxHeight, scrollBoxTop]
  );

  const handleScrollThumbMouseDown = useCallback((e: { preventDefault: () => void; stopPropagation: () => void; clientY: React.SetStateAction<number>; }) => {
    e.preventDefault();
    e.stopPropagation();
    setScrollThumbPosition(e.clientY);
    setDragging(true);
  }, []);

  const handleScroll = useCallback(() => {
    if (!ref) {
      return;
    }
    const scrollHostElement = document.body;
    const { scrollHeight } = scrollHostElement;
    const offsetHeight = window.innerHeight
    const scrollTop = document.scrollingElement?.scrollTop!

    let newTop = (parseInt(`${scrollTop}`, 10) / parseInt(`${scrollHeight}`, 10)) * offsetHeight;
    newTop = Math.min(newTop, offsetHeight - scrollBoxHeight);
    setScrollBoxTop(newTop);
    if (!hovering) {
        setShow(true)
        timeOut()
    }
  }, []);

  const handleResize = () => {
    if (ref.current) {
        const scrollHostElement = document.body;
        const { scrollHeight } = scrollHostElement;
        const scrollThumbPercentage = window.innerHeight / scrollHeight;
        const scrollThumbHeight = Math.max(
            scrollThumbPercentage * window.innerHeight,
            SCROLL_BOX_MIN_HEIGHT
        );
        if (scrollThumbHeight >= window.innerHeight) {
            setIsActive(false);
            return;
        }
        else {
            setIsActive(true);
        }
        setScrollBoxHeight(scrollThumbHeight);
        window.addEventListener("scroll", handleScroll, true);
        return function cleanup() {
            window.removeEventListener("scroll", handleScroll, true);
        };
    }
  }

  const timeOut = () => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
        setShow(false)
      }, 2000)
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)

    const resizeObserver = new ResizeObserver(entries => handleResize())
    resizeObserver.observe(document.body)

    return function cleanup() {
        window.removeEventListener('resize', handleResize)
    }
  }, []);

  useEffect(() => {
    // handle the dragging on scroll-thumb
    window.addEventListener("mousemove", handleDocumentMouseMove);
    window.addEventListener("mouseup", handleDocumentMouseUp);
    window.addEventListener("mouseleave", handleDocumentMouseUp);
    return function cleanup() {
        window.removeEventListener("mousemove", handleDocumentMouseMove);
        window.removeEventListener("mouseup", handleDocumentMouseUp);
        window.removeEventListener("mouseleave", handleDocumentMouseUp);
    };
  }, [handleDocumentMouseMove, handleDocumentMouseUp]);


  return (
    <div
        className={styles.scrollhostContainer}
        >
      <div
        ref={ref}
      >
        {children}
      </div>
      { isActive && 
      <div onMouseOver={handleMouseOver}
           onMouseOut={handleMouseOut}
           className={styles.scrollBar}
           style={{ opacity: (hovering || isDragging || show)? 1 : 0, transition: '0.3s' }}
           >
            <div
            ref={thumb}
            className={`${styles.scrollThumb}, ${styles.shiny}`}
            style={{ height: scrollBoxHeight, top: scrollBoxTop }}
            onMouseDown={handleScrollThumbMouseDown}
            />
      </div>
    }
    </div>
  );
}


export default CustomScrollBar;