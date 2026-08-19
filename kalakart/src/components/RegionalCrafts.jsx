import { regionalCrafts } from '../data/products'
import useReveal from '../useReveal'
import './RegionalCrafts.css'

export default function RegionalCrafts() {
  const headRef = useReveal()

  return (
    <section className="regional-crafts">
      <div className="container">
        <div className="section-head fade-up" ref={headRef}>
          <span className="eyebrow">Across India</span>
          <h2>A Craft for Every Region</h2>
          <p>Each state carries its own signature technique, passed from hand to hand for generations.</p>
        </div>

        <div className="regional-grid">
          {regionalCrafts.map((item, i) => (
            <RegionalCard key={item.state} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function RegionalCard({ item, index }) {
  const ref = useReveal()
  return (
    <div className="regional-card fade-up" ref={ref} style={{ transitionDelay: `${(index % 4) * 70}ms` }}>
      <div className="regional-card__image" style={{ backgroundImage: `url(${item.image})` }} />
      <div className="regional-card__label">
        <span className="regional-card__craft">{item.craft}</span>
        <span className="regional-card__state">{item.state}</span>
      </div>
    </div>
  )
}
