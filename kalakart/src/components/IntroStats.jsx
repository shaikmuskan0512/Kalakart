import useReveal from '../useReveal'
import './IntroStats.css'

const STATS = [
  { value: '500+', label: 'Artisan Communities' },
  { value: '28+', label: 'Cultural Regions' },
  { value: '1000+', label: 'Traditional Crafts' },
  { value: '100%', label: 'Handcrafted Stories' },
]

export default function IntroStats() {
  const ref = useReveal()
  return (
    <section className="intro-stats">
      <div className="container">
        <div className="intro-stats__grid fade-up" ref={ref}>
          <div className="intro-stats__text">
            <span className="eyebrow">Our Story</span>
            <h2>India, Crafted by Hand</h2>
            <p>
              For centuries, India's villages and city lanes have been home to weavers,
              potters and painters who turn raw material into heirlooms. KalaKart brings
              their work directly to your home — no middlemen, no mass production, just
              the patient hand of a craftsperson and the story behind every piece.
            </p>
          </div>

          <div className="intro-stats__numbers">
            {STATS.map((stat) => (
              <div key={stat.label} className="stat">
                <span className="stat__value">{stat.value}</span>
                <span className="stat__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
