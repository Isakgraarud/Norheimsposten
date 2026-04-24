import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Masthead from '../components/Masthead.jsx'
import { fetchArticleById } from '../services/articleService'
import '../styles/np-front-page.css'

function ArticlePage() {
  const { articleId } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadArticle = async () => {
      setError('')
      setIsLoading(true)

      try {
        const loadedArticle = await fetchArticleById(articleId)
        setArticle(loadedArticle)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadArticle()
  }, [articleId])

  const readableDate = useMemo(() => {
    if (!article) {
      return ''
    }

    const sourceDate = article.publishedAt || article.createdAt
    if (!sourceDate) {
      return ''
    }

    return new Date(sourceDate).toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }, [article])

  return (
    <div className="np-page-shell">
      <Masthead onSectionSelect={() => navigate('/')} activeSection="Home" />

      <main className="np-main" id="main-content">
        {isLoading ? <p>Laster artikkel...</p> : null}
        {error ? <p style={{ color: '#c53030' }}>{error}</p> : null}

        {!isLoading && !error && article ? (
          <article className="np-article-view">
            <header className="np-article-view-header">
              <p className="np-category">{article.category}</p>
              <h1>{article.title}</h1>
              {article.ingress ? <p className="np-article-view-ingress">{article.ingress}</p> : null}

              <div className="np-article-view-meta">
                <span>{article.authorName || 'Redaksjonen'}</span>
                {readableDate ? <time dateTime={article.publishedAt || article.createdAt}>{readableDate}</time> : null}
              </div>
            </header>

            <section className="np-article-view-content">
              {article.content
                .split('\n')
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={`${article._id}-paragraph-${index}`}>{paragraph}</p>
                ))}
            </section>

            <p className="np-article-view-backlink">
              <Link to="/">Tilbake til forsiden</Link>
            </p>
          </article>
        ) : null}
      </main>

      <footer className="np-footer">
        <p>Footer TEXT | &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default ArticlePage
