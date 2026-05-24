import ArticleCard from './ArticleCard.jsx'

function FrontPageLayout({ articles }) {
  if (!articles?.length) {
    return <p className="np-empty">Ingen artikler publisert ennå.</p>
  }

  const [hero, ...rest] = articles
  const side = rest.slice(0, 3)
  const secondary = rest.slice(3, 6)
  const compact = rest.slice(6, 10)
  const headlines = rest.slice(10)

  return (
    <div className="np-front-layout">
      <section className="np-lead-band" aria-label="Hovedoppslag">
        <div className="np-hero">
          <ArticleCard article={hero} variant="hero" />
        </div>
        {side.length ? (
          <aside className="np-side-rail" aria-label="Mer å lese">
            {side.map((article) => (
              <ArticleCard key={article._id} article={article} variant="compact" />
            ))}
          </aside>
        ) : null}
      </section>

      {secondary.length ? (
        <section className="np-secondary-band" aria-label="Aktuelt">
          <header className="np-band-head">
            <span className="np-band-label">Aktuelt</span>
            <span className="np-band-rule" aria-hidden="true" />
          </header>
          <div className="np-secondary-grid">
            {secondary.map((article) => (
              <ArticleCard key={article._id} article={article} variant="standard" />
            ))}
          </div>
        </section>
      ) : null}

      {compact.length ? (
        <section className="np-compact-band" aria-label="Mer fra redaksjonen">
          <header className="np-band-head">
            <span className="np-band-label">Mer å lese</span>
            <span className="np-band-rule" aria-hidden="true" />
          </header>
          <div className="np-compact-grid">
            {compact.map((article) => (
              <ArticleCard key={article._id} article={article} variant="compact" />
            ))}
          </div>
        </section>
      ) : null}

      {headlines.length ? (
        <section className="np-headlines-band" aria-label="Korte overskrifter">
          <header className="np-band-head">
            <span className="np-band-label">Kort sagt</span>
            <span className="np-band-rule" aria-hidden="true" />
          </header>
          <ul className="np-headlines-list">
            {headlines.map((article) => (
              <li key={article._id}>
                <ArticleCard article={article} variant="headline" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

export default FrontPageLayout
