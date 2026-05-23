import { useEffect, useMemo, useState } from 'react'
import ArticleCard from '../components/ArticleCard.jsx'
import FrontPageLayout from '../components/FrontPageLayout.jsx'
import Masthead from '../components/Masthead.jsx'
import SectionBlock from '../components/SectionBlock.jsx'
import { fetchArticles } from '../services/articleService'
import '../styles/np-front-page.css'

function NPFrontPage({ initialSection = 'Home', articleCategory = '' }) {
  const [activeSection, setActiveSection] = useState(initialSection)
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadArticles = async () => {
      setError('')
      setIsLoading(true)

      try {
        const loadedArticles = await fetchArticles(articleCategory)
        setArticles(loadedArticles)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadArticles()
  }, [articleCategory])

  const handleSectionSelect = (section) => {
    setActiveSection(section)
    if (section === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const visibleArticles = useMemo(() => {
    if (articleCategory) {
      return articles
    }

    if (activeSection === 'Home') {
      return articles
    }

    return articles.filter((article) => article.category === activeSection)
  }, [activeSection, articleCategory, articles])

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

  const isFrontPage = !articleCategory && activeSection === 'Home'
  const cardModels = visibleArticles.map(toArticleCardModel)

  return (
    <div className="np-page-shell">
      <Masthead onSectionSelect={handleSectionSelect} activeSection={activeSection} />

      <main className="np-main" id="main-content">
        {isLoading ? <p className="np-status">Laster artikler...</p> : null}
        {error ? <p className="np-status np-status-error">{error}</p> : null}

        {!isLoading && !error ? (
          isFrontPage ? (
            <FrontPageLayout articles={cardModels} />
          ) : (
            <SectionBlock title={activeSection} subtitle="Siste publiserte saker">
              {cardModels.length ? (
                <div className="np-section-grid">
                  {cardModels.map((article) => (
                    <ArticleCard key={article._id} article={article} variant="standard" />
                  ))}
                </div>
              ) : (
                <p>Ingen artikler i denne kategorien ennå.</p>
              )}
            </SectionBlock>
          )
        ) : null}
      </main>

      <footer className="np-footer">
        <p>Footer TEXT | &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default NPFrontPage
