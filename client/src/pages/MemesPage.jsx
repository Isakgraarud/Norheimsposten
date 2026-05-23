import { useState } from 'react'
import Masthead from '../components/Masthead.jsx'
import '../styles/np-front-page.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchArticleById } from '../services/articleService'


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
                <p>hello world</p>
            </main>
        </div>
    )
}
