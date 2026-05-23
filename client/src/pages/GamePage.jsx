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
				<section className="np-about-section">
					<header className="np-about-header">
						<h1>Games</h1>
						<p className="np-about-tagline">Play the built-in mini game from Norheimsposten</p>
					</header>

					<article className="np-about-content">
						<section className="np-about-block">
							<h2>Flappy Bird</h2>
							<p>The game lives on its own route, so this page acts as the games hub.</p>
							<p>
								<Link to="/flappy">Open Flappy Bird</Link>
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

export default GamePage