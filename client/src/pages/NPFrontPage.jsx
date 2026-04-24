import { useEffect, useMemo, useState } from 'react'
import ArticleCard from '../components/ArticleCard.jsx'
import Masthead from '../components/Masthead.jsx'
import SectionBlock from '../components/SectionBlock.jsx'
import { fetchArticles } from '../services/articleService'
import '../styles/np-front-page.css'

function NPFrontPage() {
  const [activeSection, setActiveSection] = useState('Forside')
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadArticles = async () => {
      setError('')
      setIsLoading(true)

      try {
        const loadedArticles = await fetchArticles()
        setArticles(loadedArticles)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadArticles()
  }, [])

  const handleSectionSelect = (section) => {
    setActiveSection(section)
    if (section === 'Forside') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const visibleArticles = useMemo(() => {
    if (activeSection === 'Forside') {
      return articles
    }

    return articles.filter((article) => article.category === activeSection)
  }, [activeSection, articles])

  const toArticleCardModel = (article) => {
    const publishedAt = article.publishedAt || article.createdAt
    const publishedDate = publishedAt ? new Date(publishedAt) : null

    return {
      ...article,
      byline: article.authorName || 'Redaksjonen',
      timestamp: publishedDate ? publishedDate.toISOString() : new Date().toISOString(),
      readableTime: publishedDate
        ? publishedDate.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })
        : '',
    }
  }

  return (
    <div className="np-page-shell">
      <Masthead onSectionSelect={handleSectionSelect} activeSection={activeSection} />

      <main className="np-main" id="main-content">
        {isLoading ? <p>Laster artikler...</p> : null}
        {error ? <p style={{ color: '#c53030' }}>{error}</p> : null}

        {!isLoading && !error ? (
          <SectionBlock title={activeSection} subtitle="Siste publiserte saker">
            {visibleArticles.length ? (
              visibleArticles.map((article) => (
                <ArticleCard key={article._id} article={toArticleCardModel(article)} />
              ))
            ) : (
              <p>Ingen artikler i denne kategorien ennå.</p>
            )}
          </SectionBlock>
        ) : null}
      </main>

      <footer className="np-footer">
        <p>Footer TEXT | &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default NPFrontPage