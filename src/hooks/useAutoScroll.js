/**
 * @file useAutoScroll.js
 * @description Automatically scrolls a container to the bottom when
 *              new content is added (e.g. new chat messages).
 *
 *              Usage:
 *              const bottomRef = useAutoScroll(messages);
 *              <div ref={bottomRef} />
 *
 *              We use a sentinel element approach rather than scrolling
 *              the container itself — this is more reliable across browsers.
 */
import { useEffect, useRef } from 'react';

/**
 * @hook useAutoScroll
 * @param {any} dependency - Scroll triggers when this value changes (usually messages array)
 * @returns {React.RefObject} - Attach to a sentinel <div> at the bottom of your list
 */
export function useAutoScroll(dependency) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      // 'smooth' gives a nice scroll animation as new messages appear
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dependency]);

  return bottomRef;
}
