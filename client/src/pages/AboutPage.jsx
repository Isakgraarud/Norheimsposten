import { useState } from 'react'
import Masthead from '../components/Masthead.jsx'
import '../styles/np-front-page.css'

function AboutPage() {
  const [activeSection] = useState('About Us')

  const handleSectionSelect = (section) => {
    if (section === 'About Us') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="np-page-shell">
      <Masthead onSectionSelect={handleSectionSelect} activeSection={activeSection} />

      <main className="np-main" id="main-content">
        <section className="np-about-section">
          <header className="np-about-header">
            <h1>About Us</h1>
            <p className="np-about-tagline">News from the legendary Simon Norheim</p>
          </header>

          <article className="np-about-content">
            <section className="np-about-block">
              <h2>Our Mission</h2>
              <p>
                Look, we know you’re busy. That’s why Norheimsposten is 100% committed to bringing you medium-ish quality, semi-indie news.
                We aren't the best, but we are definitely "there."
                <br></br>
                We write stuff for people who grew up in Nordre Aker and still haven't moved on emotionally.
                Even though everyone lives in different places now and probably can't find your way back without Google Maps,
                we want to keep us all together.
              </p>
            </section>

            <section className="np-about-block">
              <h2>Our History</h2>
              <p>
                Founded with a commitment to local journalism, Norheimsposten wants to be the cornerstone of our community.
                We're dedicated to covering the stories that matter most to our readers.
              </p>
            </section>

            <section className="np-about-block">
              <h2>What We Cover</h2>
              <p>
                Our newsroom covers a wide range of topics to keep you informed about what's happening in and around
                Norheim. Whether it's breaking news, in-depth investigations, or community spotlights, we're here to
                bring you the stories that matter.
              </p>
              <ul className="np-about-list">
              </ul>
            </section>

            <section className="np-about-block">
              <h2>Our Values</h2>
              <p>
                Values?
              </p>
            </section>

            <section className="np-about-block">
              <h2>Get In Touch</h2>
              <p>
                We value feedback from our readers and the community. Have a story tip? Want to advertise with us? Or
                just want to say hello? Feel free to reach out to us through e-mail.
              </p>
            </section>
          </article>
        </section>
      </main>

      <footer className="np-footer">
        <p>Footer TEXT | &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default AboutPage
