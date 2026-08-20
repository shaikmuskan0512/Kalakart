import { useEffect, useRef, useState } from 'react'
import './Hero.css'

const SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1600&q=85",
    tag: "The Weaver's Loom",
    caption:
      "Every saree begins on a wooden loom, thread by patient thread.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=85",
    tag: "Silk & Zari",
    caption:
      "Banarasi and Kanchipuram weaves, brocaded with real zari.",
  },
  {
  image:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=85",
  tag: "Hands That Remember",
  caption:
    "Artisans carrying techniques passed down for generations.",
},
  {
  image:
    "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1600&q=85",
  tag: "Earth & Fire",
  caption:
    "Terracotta and blue pottery, shaped on the wheel by hand.",
},
];
export default function Hero() {
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  const next = () => setIndex((i) => (i + 1) % SLIDES.length)
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)

  useEffect(() => {
    timerRef.current = setInterval(next, 5500)
    return () => clearInterval(timerRef.current)
  }, [])

  const restart = (fn) => {
    clearInterval(timerRef.current)
    fn()
    timerRef.current = setInterval(next, 5500)
  }

  return (
    <section id="home" className="hero">
      <div className="hero__slides">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.tag}
            className={`hero__slide ${i === index ? 'is-active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
            aria-hidden={i !== index}
          />
        ))}
        <div className="hero__overlay" />
      </div>

      <div className="hero__content container">
        <span className="eyebrow hero__eyebrow">{SLIDES[index].tag}</span>
        <h1 className="hero__title">Tradition Woven Into Every Thread</h1>
        <p className="hero__desc">
          Discover timeless Indian craftsmanship, handcrafted by skilled artisans and
          inspired by generations of tradition.
        </p>
        <div className="hero__actions">
          <a href="#shop" className="btn btn-primary">Explore Collection</a>
          <a href="#about" className="btn btn-outline">Discover Artisans</a>
        </div>
      </div>

      <button className="hero__arrow hero__arrow--left" onClick={() => restart(prev)} aria-label="Previous slide">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button className="hero__arrow hero__arrow--right" onClick={() => restart(next)} aria-label="Next slide">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <div className="hero__dots">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.tag}
            className={`hero__dot ${i === index ? 'is-active' : ''}`}
            onClick={() => restart(() => setIndex(i))}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
