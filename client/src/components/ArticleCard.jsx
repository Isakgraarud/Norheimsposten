import { Link } from 'react-router-dom'

function ArticleCard({ article, variant = 'standard' }) {
  if (!article) {
    return null
  }

  const articleMarkup = (
    <article className={`np-article np-article-${variant}`}>
      <header>
        <p className="np-category">{article.category}</p>
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
