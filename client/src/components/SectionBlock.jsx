function SectionBlock({ title, subtitle, children }) {
  return (
    <section className="np-section-block" aria-label={title}>
      <header className="np-section-head">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>
      {children}
    </section>
  )
}

export default SectionBlock
