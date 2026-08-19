import { useApp } from '../store'
import FilterSidebar from './FilterSidebar'
import ProductCard from './ProductCard'
import useReveal from '../useReveal'
import './ProductSection.css'

export default function ProductSection() {
  const {
    filteredProducts,
    sortBy,
    setSortBy,
    setFilterDrawerOpen,
    search
  } = useApp()

  const headRef = useReveal()

  return (
    <section className="product-section">
      <div className="product-section__heading" ref={headRef}>
        <h2>Featured Collection</h2>

        <p>
          Handpicked treasures created by India's skilled artisans.
          Every piece is sourced directly from the artisan or craft
          collective that made it.
        </p>
      </div>

      <div className="product-section__layout">
        <FilterSidebar variant="sidebar" />

        <div className="product-section__main">
          <div className="product-section__toolbar">
            <button
              className="product-section__filter-btn"
              onClick={() => setFilterDrawerOpen(true)}
            >
              Filters
            </button>

            <span className="product-section__count">
              {filteredProducts.length} pieces
            </span>

            <select
              className="product-section__sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p._id || p.id}
                  product={p}
                />
              ))}
            </div>
          ) : (
            <div className="product-empty">
              <h3>No treasures found</h3>

              <p>
                {search
                  ? 'Try searching for another craft or category.'
                  : 'No products are available right now.'}
              </p>
            </div>
          )}
        </div>
      </div>

      <FilterSidebar variant="drawer" />
    </section>
  )
}