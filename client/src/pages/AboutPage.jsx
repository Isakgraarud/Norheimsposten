import { useState } from 'react'
import Masthead from '../components/Masthead.jsx'
import '../styles/np-front-page.css'
import '../styles/np-about-page.css'

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
        <div className="np-about-root">
          <div>
            <h1> Hvem vi er </h1>
            <br/>
          </div>
          <div className="np-about-intro">
            Norheimsposten er en uavhengig redaksjon bestående av fire Oslo-gutter fra Kjelsås, alle i aktiv
            forfølgelse av samfunnets formelle definisjon av suksess. Vi dekker sakene andre ikke gidder å
            dekke, med den grundigheten de ikke fortjener.
          </div>

          <div className="np-about-grid">

            <div className="np-about-card">
              <div className="np-about-avatar">SN</div>
              <p className="np-about-card-name">Simon Norheim</p>
              <p className="np-about-card-role">Redaktør · Journalist · Reporter · Fotograf · Kommentator · Korrespondent</p>
              <p className="np-about-card-body">

              Simon er hjernen og sjelen bak Norheimsposten, og påtar seg med stort
              alvor samtlige redaksjonelle roller avisen har å tilby. Til daglig studerer han ved
              Luftforsvarsskolen. Han brygger sitt eget øl, har fullført ultramaraton, han er rett å slett en sikklig mannemann.
              Han eier desverre ikke en Tesla.</p>
            </div>

            <div className="np-about-card">
              <div className="np-about-avatar">IB</div>
              <p className="np-about-card-name">Ivar Oppheim Barmen</p>
              <p className="np-about-card-role">Porteføljeforvalter Eiendom</p>
              <p className="np-about-card-body">

              Ivar studerer ved NTNU og forvalter eiendomsporteføljen til Norheimsposten.
              Han er også stolt eier av en Tesla. Dette ble nevnt under intervjuet tre ganger uten at det ble spurt om.
              Redaksjonen ønsker å presisere at vi er glade på hans vegne. Han har også sin egen grill.</p>
            </div>

            <div className="np-about-card">
              <div className="np-about-avatar">IG</div>
              <p className="np-about-card-name">Isak Graarud</p>
              <p className="np-about-card-role">Chief Technology Officer · UI/UX Designer</p>
              <p className="np-about-card-body">

              Isak er den teknologiske ryggraden i Norheimsposten og studerer
              Informatikk ved UIB. Som CTO sørger han for at avisens digitale infrastruktur holder et nivå
              ingen av de andre forstår seg på (noen ganger ikke han engang).
              Isak er også syklist. Han eier en Cannondale Synapse Carbon Ultegra han bruker så ofte han kan. Han har ikke tesla.</p>
            </div>

            <div className="np-about-card">
              <div className="np-about-avatar">VH</div>
              <p className="np-about-card-name">Victor Beisland Hessevaagbakke</p>
              <p className="np-about-card-role">Chief Information Security Officer</p>
              <p className="np-about-card-body">

              Victor sikrer at Norheimspostens digitale verdier er beskyttet mot
              trusler utenfra. Han studerer Digital infrastruktur og cybersikkerhet ved NTNU, og har vært i
              Pakistan på oppdrag for universitetet noe redaksjonen er stolte av. </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="np-footer">
        <p>Norheimsposten.no | &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default AboutPage