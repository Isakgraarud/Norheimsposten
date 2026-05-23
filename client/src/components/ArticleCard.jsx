import { Link } from 'react-router-dom'
import { getCategoryRoute } from '../utils/categoryRoutes.js'

function ArticleCard({ article, variant = 'standard' }) {
  if (!article) {
    return null
  }

  const categoryRoute = getCategoryRoute(article.category)

  const articleMarkup = (
    <article className={`np-article np-article-${variant}`}>
      <header>
        {categoryRoute ? (
          <Link className="np-category" to={categoryRoute}>
            {article.category}
          </Link>
        ) : (
          <p className="np-category">{article.category}</p>
        )}
        <h3>{article.title}</h3>
      </header>

      <p className="np-ingress">{article.ingress}</p>

      <footer>
        <span>{article.byline}</span>
        <time dateTime={article.timestamp}>{article.readableTime}</time>
      </footer>
    </article>
  )

  if (!article._id) {
    return articleMarkup
  }

  return (
    <Link className="np-article-link" to={`/articles/${article._id}`} aria-label={`Les artikkel: ${article.title}`}>
      {articleMarkup}
    </Link>
  )
}

export default ArticleCard
