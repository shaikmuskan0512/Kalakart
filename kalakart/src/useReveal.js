import { useEffect, useRef } from 'react'

/**
 * Adds an 'is-visible' class to the element once it scrolls into view.
 * Pair with the .fade-up class for a subtle rise-and-fade entrance.
 */
export default function useReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15, ...options }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return ref
}
