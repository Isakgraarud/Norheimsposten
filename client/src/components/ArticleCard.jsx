import { Link } from 'react-router-dom'
import { getCategoryRoute } from '../utils/categoryRoutes.js'

function ArticleCard({ article, variant = 'standard' }) {
  if (!article) {
    return null
  }

  const categoryRoute = getCategoryRoute(article.category)
  const showImage = variant !== 'headline' && Boolean(article.picture)
  const showIngress = variant !== 'headline' && Boolean(article.ingress)

  const articleMarkup = (
    <article className={`np-article np-article-${variant}`}>
      {showImage ? (
        <figure className="np-article-figure">
          <img src={article.picture} alt={article.title} loading="lazy" />
        </figure>
      ) : null}

      <div className="np-article-body">
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

        {showIngress ? <p className="np-ingress">{article.ingress}</p> : null}

        <footer>
          <span>{article.byline}</span>
          <time dateTime={article.timestamp}>{article.readableTime}</time>
        </footer>
      </div>
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
