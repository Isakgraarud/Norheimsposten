import NPFrontPage from './NPFrontPage.jsx'
import Masthead from "../components/Masthead.jsx";
import {useState} from "react";

function MemesPage() {
    const [activeSection] = useState('Memes')

    const handleSectionSelect = (section) => {
        if (section === 'Memes') {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <div className="np-page-shell">
            <Masthead onSectionSelect={handleSectionSelect} activeSection={activeSection} />

            <main className="np-main" id="main-content">
                <div className="np-about-root">
                    <main>404 - "Memes" Not implemented (victor her har du en jobb å gjøre)</main>
                </div>
            </main>
            <footer className="np-footer">
                <p>Norheimsposten.no | &copy; {new Date().getFullYear()}</p>
            </footer>
        </div>
    )
}

export default MemesPage