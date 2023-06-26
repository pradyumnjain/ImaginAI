import { useEffect, useRef, useState } from 'react'

export default function useElementOnScreen<T extends Element>(
  options: IntersectionObserverInit
) {
  const containerRef = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const { current } = containerRef
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries
      setIsVisible(entry.isIntersecting)
    }, options)
    if (current) observer.observe(current)
    return () => {
      if (current) observer.unobserve(current)
    }
  }, [containerRef, options])

  return { containerRef, isVisible }
}
