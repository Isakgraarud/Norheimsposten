import { useEffect, useState } from 'react'

function App() {
  const [movies, setMovies] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true) // Lagt til for bedre brukeropplevelse

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies')

        if (!response.ok) {
          throw new Error(`Serverfeil: ${response.status}`)
        }

        const data = await response.json()
        setMovies(data)
      } catch (err) {
        console.error(err)
        setError('Kunne ikke laste filmer. Sjekk at backend-serveren kjører.')
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Norheimsposten MERN App</h1>
        <h2>Filmer fra MongoDB</h2>

        {/* 1. Vis feilmelding hvis noe går galt */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* 2. Vis lademelding mens vi venter på data */}
        {loading && !error && <p>Laster filmer...</p>}

        {/* 3. Vis melding hvis listen faktisk er tom etter lasting */}
        {!loading && !error && movies.length === 0 && <p>Ingen filmer funnet i databasen.</p>}

        {/* 4. VIKTIG: Vis filmene når movies.length er STØRRE enn 0 */}
        {!error && movies.length > 0 && (
            <div style={{ display: 'grid', gap: '20px' }}>
              {movies.map((movie) => (
                  <div
                      key={movie._id}
                      style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}
                  >
                    <h3>{movie.title} ({movie.year ?? 'N/A'})</h3>

                    <div style={{ display: 'flex', gap: '15px' }}>
                      {movie.poster && (
                          <img
                              src={movie.poster}
                              alt={movie.title}
                              style={{ width: '100px', height: 'auto', borderRadius: '4px' }}
                          />
                      )}

                      <div>
                        <p><strong>Sjanger:</strong> {movie.genres?.join(', ') || 'Ukjent'}</p>
                        <p>{movie.plot || 'Ingen beskrivelse tilgjengelig.'}</p>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
        )}
      </div>
  )
}

export default App