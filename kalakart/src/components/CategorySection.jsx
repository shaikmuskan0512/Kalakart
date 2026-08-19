import { categories } from '../data/products'
import { useApp } from '../store'
import useReveal from '../useReveal'
import './CategorySection.css'

export default function CategorySection() {
  const { setActiveCategory } = useApp()
  const headRef = useReveal()

  const handleClick = (id) => {
    setActiveCategory(id)
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="categories" className="category-section">
      <div className="container">
        <div className="section-head fade-up" ref={headRef}>
          <span className="eyebrow">Shop by Category</span>
          <h2>Explore Indian Craftsmanship</h2>
          <p>Discover timeless crafts from every corner of India.</p>
        </div>

        <div className="category-grid">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} onClick={() => handleClick(cat.id)} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoryCard({ category, index, onClick }) {
  const ref = useReveal()
  return (
    <button
      className="category-card fade-up"
      ref={ref}
      style={{ transitionDelay: `${(index % 4) * 80}ms` }}
      onClick={onClick}
    >
      <div className="category-card__image" style={{ backgroundImage: `url(${category.image})` }} />
      <div className="category-card__body">
        <div>
          <h3>{category.name}</h3>
          <p>{category.description}</p>
        </div>
        <span className="category-card__arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </button>
  )
}
