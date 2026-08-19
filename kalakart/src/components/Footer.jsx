import { useState } from 'react'
import { useApp } from '../store'
import './Footer.css'

const COLUMNS = [
  { title: 'Shop', links: ['Sarees', 'Handicrafts', 'Jewellery', 'Home Decor'] },
  { title: 'About', links: ['Our Story', 'Artisans', 'Our Mission'] },
  { title: 'Customer Care', links: ['Contact', 'Shipping', 'Returns', 'FAQ'] },
]

const SOCIAL = ['Instagram', 'Facebook', 'Pinterest']

export default function Footer() {
  const { showToast } = useApp()
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    showToast('✓ Subscribed to the newsletter')
    setEmail('')
  }

  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <span className="footer__logo">KalaKart</span>
          <p>Preserving tradition. Celebrating craftsmanship.</p>
        </div>

        <div className="footer__columns">
          {COLUMNS.map((col) => (
            <div key={col.title} className="footer__col">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link}><a href="#">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer__col">
            <h4>Connect</h4>
            <ul>
              {SOCIAL.map((s) => (
                <li key={s}><a href="#">{s}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__newsletter">
          <h4>Join the KalaKart community</h4>
          <form onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="thread-divider container" />

      <div className="container footer__bottom">
        <span>© 2026 KalaKart. Celebrating Indian craftsmanship.</span>
      </div>
    </footer>
  )
}
