import useReveal from '../useReveal'
import './WhyKalaKart.css'

const FEATURES = [
  {
    title: 'Authentic Crafts',
    desc: 'Traditional crafts inspired by India\'s rich heritage.',
    icon: (
      <path d="M4 12l8-8 8 8-8 8-8-8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    ),
  },
  {
    title: 'Artisan First',
    desc: 'Celebrating the skilled communities behind every creation.',
    icon: (
      <>
        <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5 20c1-3.6 4-5.5 7-5.5s6 1.9 7 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: 'Thoughtful Delivery',
    desc: 'Carefully packed products delivered to your doorstep.',
    icon: (
      <>
        <path d="M4 8h13l3 4v7H4V8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <circle cx="8" cy="19.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="17" cy="19.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      </>
    ),
  },
  {
    title: 'Sustainable Choices',
    desc: 'Supporting traditional and sustainable craftsmanship.',
    icon: (
      <path d="M12 21s-7-4.5-7-10.5A5 5 0 0 1 12 6a5 5 0 0 1 7 4.5C19 16.5 12 21 12 21Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    ),
  },
]

export default function WhyKalaKart() {
  const headRef = useReveal()
  return (
    <section className="why-kalakart">
      <div className="container">
        <div className="section-head fade-up" ref={headRef}>
          <span className="eyebrow">Why KalaKart</span>
          <h2>Made With Intention</h2>
        </div>

        <div className="why-grid">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature, index }) {
  const ref = useReveal()
  return (
    <div className="why-card fade-up" ref={ref} style={{ transitionDelay: `${index * 80}ms` }}>
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">{feature.icon}</svg>
      <h3>{feature.title}</h3>
      <p>{feature.desc}</p>
    </div>
  )
}
