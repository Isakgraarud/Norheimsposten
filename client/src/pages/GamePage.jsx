import { Link } from 'react-router-dom'
import Masthead from '../components/Masthead.jsx'
import '../styles/np-front-page.css'

function GamePage() {
	const handleSectionSelect = (section) => {
		if (section === 'Games') {
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}

	return (
		<div className="np-page-shell">
			<Masthead onSectionSelect={handleSectionSelect} activeSection="Games" />

			<main className="np-main" id="main-content">
				<div className="np-about-root">
				<section className="np-about-section">
					<header className="np-about-header">
						<h1>FlappyBird</h1>
						<p className="np-about-tagline">I likhet med andre store aviser har og så Norheimsposten sitt eget spill</p>
					</header>

					<article className="np-about-content">
						<section className="np-about-block">
							<h2>Flappy Bird</h2>
							<div onClick={ () => alert("Isak ... dette må du fikse sjæl ass")}>
                                <p>Lyst til å spille Flappy Bird? trykk --{">"} her!</p>

                            </div>
							
						</section>
					</article>
				</section>
				</div>
			</main>

			<footer className="np-footer">
				<p>Footer TEXT | &copy; {new Date().getFullYear()}</p>
			</footer>
		</div>
	)
}

export default GamePage