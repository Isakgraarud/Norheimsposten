import NPFrontPage from './NPFrontPage.jsx'
import {useState} from "react";
import Masthead from "../components/Masthead.jsx";

function NewsPage() {
	const [activeSection] = useState('News')

	const handleSectionSelect = (section) => {
		if (section === 'News') {
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}

	return (
		<div className="np-page-shell">
			<Masthead onSectionSelect={handleSectionSelect} activeSection={activeSection} />

			<main className="np-main" id="main-content">
				<div className="np-about-root">
					<main>404 - "NEWS" Not implemented (victor her har du en jobb å gjøre)</main>
				</div>
			</main>
			<footer className="np-footer">
				<p>Norheimsposten.no | &copy; {new Date().getFullYear()}</p>
			</footer>
		</div>
	)
}

export default NewsPage