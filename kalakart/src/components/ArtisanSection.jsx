import useReveal from '../useReveal'
import './ArtisanSection.css'

export default function ArtisanSection() {
  const ref = useReveal()

  return (
    <section id="about" className="artisan-section">
      <div className="container artisan-section__grid fade-up" ref={ref}>
        <div className="artisan-section__image">
  <img
    src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=700&q=80"
    alt="Indian artisan working on traditional handicrafts"
  />
</div>

        <div className="artisan-section__text">
          <span className="eyebrow">Our Purpose</span>
          <h2>Behind Every Craft Is a Story</h2>
          <p>
            Every thread, stroke and carving carries generations of knowledge. KalaKart
            celebrates India's artisans and the traditions they continue to keep alive —
            connecting their work with people who value what it took to make it.
          </p>
          <a href="#about" className="btn btn-dark">Meet Our Artisans</a>
        </div>
      </div>
    </section>
  )
}
