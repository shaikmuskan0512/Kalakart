
import { categories, states } from '../data/products'
import { useApp } from '../store'
import './FilterSidebar.css'

const RATINGS = [4, 3, 2];

export default function FilterSidebar({ variant = "sidebar" }) {
 const {
  activeCategory,
  setActiveCategory,
  maxPrice,
  setMaxPrice,
  activeStates,
  toggleStateFilter,
  minRating,
  setMinRating,
  clearFilters,
  filterDrawerOpen,
  setFilterDrawerOpen,
} = useApp();
  const isDrawer = variant === "drawer";

  const content = (
    <div className="filters">
      <div className="filters__header">
        <h3>Filters</h3>

        <button
          type="button"
          className="filters__clear"
          onClick={clearFilters}
        >
          Clear all
        </button>
      </div>

      {/* CATEGORY */}
      <div className="filters__group">
        <h4>Category</h4>

        <ul>
          <li>
            <button
              type="button"
              className={activeCategory === "all" ? "is-active" : ""}
              onClick={() => setActiveCategory("all")}
            >
              All
            </button>
          </li>

          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                className={
                  activeCategory === cat.id ? "is-active" : ""
                }
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* PRICE */}
      <div className="filters__group">
        <h4>Price</h4>

        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={Number(maxPrice || 10000)}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="filters__slider"
        />

        <div className="filters__price-labels">
          <span>₹0</span>

          <span>
            ₹{Number(maxPrice || 0).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* STATE */}
      <div className="filters__group">
        <h4>State</h4>

        <ul className="filters__states">
          {states.map((state) => (
            <li key={state}>
              <label>
                <input
                  type="checkbox"
                  checked={(activeStates || []).includes(state)}
                  onChange={() => toggleStateFilter(state)}
                />

                {state}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* RATING */}
      <div className="filters__group">
        <h4>Rating</h4>

        <ul>
          {RATINGS.map((rating) => (
            <li key={rating}>
              <button
                type="button"
                className={
                  minRating === rating ? "is-active" : ""
                }
                onClick={() =>
                  setMinRating(
                    minRating === rating ? 0 : rating
                  )
                }
              >
                {rating}★ &amp; above
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // NORMAL SIDEBAR
  if (!isDrawer) {
    return content;
  }

  // MOBILE DRAWER
  return (
    <>
      <div
        className={`filter-drawer__backdrop ${
          filterDrawerOpen ? "is-open" : ""
        }`}
        onClick={() => setFilterDrawerOpen(false)}
      />

      <div
        className={`filter-drawer ${
          filterDrawerOpen ? "is-open" : ""
        }`}
      >
        <div className="filter-drawer__header">
          <h3>Filters</h3>

          <button
            type="button"
            onClick={() => setFilterDrawerOpen(false)}
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>

        {content}

        <button
          type="button"
          className="btn btn-primary filter-drawer__apply"
          onClick={() => setFilterDrawerOpen(false)}
        >
          Show Results
        </button>
      </div>
    </>
  );
}

