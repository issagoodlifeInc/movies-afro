import { useEffect, useMemo, useState } from 'react';

const demoTitles = [
  {
    id: 'drive-1997',
    title: 'Drive',
    year: 1997,
    type: 'Movie',
    genre: 'Action',
    rating: 'Not rated',
    duration: '—',
    cast: ['Mark Dacascos', 'Kadeem Hardison', 'John Pyper-Ferguson'],
    description: 'Catalog entry for the 1997 action film, added from the supplied filename. Playback remains disabled until distribution rights are verified.',
    colors: ['#233744', '#5d746a'],
    mark: 'DRIVE',
  },
  {
    id: 'ip-man-2-2010',
    title: 'Ip Man 2',
    year: 2010,
    type: 'Movie',
    genre: 'Action',
    rating: 'Not rated',
    duration: '—',
    cast: ['Donnie Yen', 'Sammo Hung', 'Huang Xiaoming'],
    description: 'Catalog entry for the 2010 martial-arts film, added from the supplied filename. Playback remains disabled until distribution rights are verified.',
    colors: ['#382b23', '#8c6349'],
    mark: 'IP MAN 2',
  },
  {
    id: 'night-of-the-living-dead',
    title: 'Night of the Living Dead',
    year: 1968,
    type: 'Movie',
    genre: 'Horror',
    rating: 'Not rated',
    duration: '1h 36m',
    cast: ['Duane Jones', 'Judith O’Dea', 'Karl Hardman'],
    description: 'A group of strangers takes shelter in a farmhouse as the dead begin to rise. This independent classic is widely recognized as public domain in the United States; verify the rights status for your territory before offering playback.',
    colors: ['#302326', '#a14e35'],
    mark: 'NIGHT',
    featured: true,
  },
  {
    id: 'his-girl-friday',
    title: 'His Girl Friday',
    year: 1940,
    type: 'Movie',
    genre: 'Comedy',
    rating: 'Not rated',
    duration: '1h 32m',
    cast: ['Cary Grant', 'Rosalind Russell', 'Ralph Bellamy'],
    description: 'A fast-talking newspaper editor tries to win back his ace reporter, who is about to leave the newsroom for a new life.',
    colors: ['#273642', '#758b87'],
    mark: 'FRIDAY',
  },
  {
    id: 'the-general',
    title: 'The General',
    year: 1926,
    type: 'Movie',
    genre: 'Adventure',
    rating: 'Not rated',
    duration: '1h 18m',
    cast: ['Buster Keaton', 'Marion Mack', 'Glen Cavender'],
    description: 'A locomotive engineer races to recover his beloved engine and rescue the woman he loves during the Civil War.',
    colors: ['#302d28', '#9a8055'],
    mark: 'THE GENERAL',
  },
  {
    id: 'detour',
    title: 'Detour',
    year: 1945,
    type: 'Movie',
    genre: 'Film Noir',
    rating: 'Not rated',
    duration: '1h 08m',
    cast: ['Tom Neal', 'Ann Savage', 'Claudia Drake'],
    description: 'A down-on-his-luck piano player hitchhikes west and finds himself caught in a chain of bad decisions.',
    colors: ['#171c28', '#51627a'],
    mark: 'DETOUR',
  },
  {
    id: 'charade',
    title: 'Charade',
    year: 1963,
    type: 'Movie',
    genre: 'Mystery',
    rating: 'Not rated',
    duration: '1h 53m',
    cast: ['Cary Grant', 'Audrey Hepburn', 'Walter Matthau'],
    description: 'A widow in Paris is pursued by dangerous strangers who all want a fortune her late husband may have hidden.',
    colors: ['#243540', '#b07c52'],
    mark: 'CHARADE',
  },
  {
    id: 'the-kid',
    title: 'The Kid',
    year: 1921,
    type: 'Movie',
    genre: 'Comedy',
    rating: 'Not rated',
    duration: '1h 08m',
    cast: ['Charlie Chaplin', 'Jackie Coogan', 'Edna Purviance'],
    description: 'A tramp raises an abandoned child in this beloved silent comedy-drama.',
    colors: ['#39322b', '#9b8a73'],
    mark: 'THE KID',
  },
  {
    id: 'a-trip-to-the-moon',
    title: 'A Trip to the Moon',
    year: 1902,
    type: 'Movie',
    genre: 'Fantasy',
    rating: 'Not rated',
    duration: '14m',
    cast: ['Georges Méliès', 'Bleuette Bernon', 'François Lallement'],
    description: 'A band of astronomers builds a capsule, journeys to the moon, and encounters its mysterious inhabitants.',
    colors: ['#233849', '#947452'],
    mark: 'MOON',
  },
  {
    id: 'sherlock-jr',
    title: 'Sherlock Jr.',
    year: 1924,
    type: 'Movie',
    genre: 'Comedy',
    rating: 'Not rated',
    duration: '45m',
    cast: ['Buster Keaton', 'Kathryn McGuire', 'Joe Keaton'],
    description: 'A movie projectionist dreams himself into a film to solve a case and win his sweetheart.',
    colors: ['#292a36', '#72748e'],
    mark: 'SHERLOCK',
  },
];

const genres = ['All titles', ...new Set(demoTitles.map((title) => title.genre))];

function AdSlot({ className = '' }) {
  const client = import.meta.env.VITE_ADSENSE_CLIENT;
  const slot = import.meta.env.VITE_ADSENSE_SLOT;
  const enabled = Boolean(client && slot);

  useEffect(() => {
    if (!enabled) return;

    const scriptId = 'adsense-loader';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
      document.head.appendChild(script);
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (error) {
      console.error('Unable to initialize the configured ad slot:', error);
    }
  }, [client, enabled, slot]);

  return (
    <aside className={`ad-slot ${className}`} aria-label="Advertisement">
      {enabled ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight: 90 }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <span>Advertisement space <span className="ad-config">Configure your ad account to enable</span></span>
      )}
    </aside>
  );
}

function Poster({ title, colors, mark, featured = false }) {
  return (
    <div
      className={`poster${featured ? ' poster-featured' : ''}`}
      style={{ '--poster-start': colors[0], '--poster-end': colors[1] }}
      role="img"
      aria-label={`${title} poster artwork placeholder`}
    >
      <span className="poster-grain" />
      <span className="poster-mark">{mark}</span>
      <span className="poster-caption">AFRO REEL • CLASSIC CINEMA</span>
    </div>
  );
}

function MovieCard({ movie, onSelect }) {
  return (
    <button className="movie-card" onClick={() => onSelect(movie)} aria-label={`View ${movie.title}`}>
      <div className="card-poster">
        <Poster {...movie} />
        <span className="card-play" aria-hidden="true">▶</span>
        <span className="card-type">{movie.type}</span>
      </div>
      <div className="card-info">
        <div className="card-title-line">
          <h3>{movie.title}</h3>
          <span>{movie.year}</span>
        </div>
        <p>{movie.genre}<span className="dot">•</span>{movie.duration}</p>
      </div>
    </button>
  );
}

function TitleDetails({ movie, onClose }) {
  if (!movie) return null;

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <button className="modal-close" onClick={onClose} aria-label="Close details">×</button>
        <Poster {...movie} featured />
        <div className="detail-copy">
          <p className="eyebrow">{movie.type} <span className="dot">•</span> {movie.year} <span className="dot">•</span> {movie.duration}</p>
          <h2 id="detail-title">{movie.title}</h2>
          <p>{movie.description}</p>
          <p><strong>Cast:</strong> {movie.cast.join(', ')}</p>
          <p><strong>Genre:</strong> {movie.genre} <span className="dot">•</span> <strong>Rating:</strong> {movie.rating}</p>
          <div className="rights-note">
            <span aria-hidden="true">ⓘ</span>
            <p>Discovery demo only. Playback is disabled until this title’s distribution rights are verified and an authorized stream is configured.</p>
          </div>
          <button className="watch-button" disabled>▶ &nbsp; Playback unavailable</button>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('All titles');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [catalog, setCatalog] = useState(demoTitles);
  const [catalogStatus, setCatalogStatus] = useState('demo');

  useEffect(() => {
    let active = true;
    fetch('/api/movies')
      .then((response) => {
        if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
        return response.json();
      })
      .then((movies) => {
        if (!Array.isArray(movies)) throw new Error('Catalog response must be a list');
        if (active && movies.length) {
          const normalized = movies.map((movie) => ({
            ...movie,
            id: movie._id || movie.id || movie.title,
            cast: Array.isArray(movie.cast) ? movie.cast : [],
            type: movie.type || 'Movie',
            duration: movie.duration || '—',
            colors: ['#202d38', '#536a72'],
            mark: movie.title,
            rightsVerified: movie.rightsVerified === true,
          }));
          setCatalog(normalized);
          setCatalogStatus('connected');
        }
      })
      .catch(() => {
        if (active) setCatalogStatus('demo');
      });
    return () => { active = false; };
  }, []);

  const filteredTitles = useMemo(() => catalog.filter((movie) => {
    const searchText = `${movie.title} ${movie.genre} ${(movie.cast || []).join(' ')}`.toLocaleLowerCase();
    const matchesSearch = searchText.includes(query.trim().toLocaleLowerCase());
    const matchesGenre = activeGenre === 'All titles' || movie.genre === activeGenre;
    return matchesSearch && matchesGenre;
  }), [activeGenre, catalog, query]);

  const featured = catalog.find((movie) => movie.featured) || catalog[0];

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Afro Reel home"><span className="brand-mark">A</span><span>AFRO<span className="brand-light">REEL</span></span></a>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-active" href="#home">Discover</a>
          <a href="#collection">Movies</a>
          <a href="#collection" onClick={() => setActiveGenre('All titles')}>Series</a>
        </nav>
        <a className="header-link" href="#collection">Browse collection <span>↗</span></a>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-art">
            {featured && <Poster {...featured} featured />}
          </div>
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow"><span className="live-dot" /> THE AFRO REEL COLLECTION</p>
            <h1>Stories worth<br />staying in for.</h1>
            <p className="hero-subtitle">Find your next favorite in a handpicked collection of cinema classics.</p>
            <div className="hero-actions">
              <a className="button-primary" href="#collection">Explore the collection <span>↓</span></a>
              <span className="collection-count">{catalog.length} titles and counting</span>
            </div>
          </div>
          <span className="hero-index">01 <span>/</span> CLASSICS</span>
        </section>

        <AdSlot className="top-ad" />

        <section className="collection-section" id="collection">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A GOOD PLACE TO START</p>
              <h2>Find your next watch<span>.</span></h2>
            </div>
            <span className="catalog-status">{catalogStatus === 'connected' ? 'LIVE CATALOG' : 'CURATED DEMO'} <i /></span>
          </div>

          <label className="search-box">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search a title, actor, or genre..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search movies and series by title, actor, or genre"
            />
            <kbd>⌘ K</kbd>
          </label>

          <div className="genre-row" aria-label="Filter by genre">
            {genres.map((genre) => (
              <button
                key={genre}
                className={`genre-chip${activeGenre === genre ? ' selected' : ''}`}
                onClick={() => setActiveGenre(genre)}
              >{genre}</button>
            ))}
          </div>

          {filteredTitles.length ? (
            <div className="movie-grid">
              {filteredTitles.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onSelect={setSelectedMovie} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span>⌕</span>
              <h3>No titles found</h3>
              <p>Try another title, actor, or genre.</p>
              <button onClick={() => { setQuery(''); setActiveGenre('All titles'); }}>Clear search</button>
            </div>
          )}
        </section>

        <AdSlot className="bottom-ad" />

        <section className="about-strip">
          <span className="about-icon">✳</span>
          <div><h2>Good films. The right way.</h2><p>We only make titles available when their streaming rights are verified. No downloads, no pirated streams—just discovery and authorized viewing.</p></div>
          <span className="about-number">01 — 03</span>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home"><span className="brand-mark">A</span><span>AFRO<span className="brand-light">REEL</span></span></a>
        <span>Independent discovery, made for movie people.</span>
        <span>© {new Date().getFullYear()} Afro Reel</span>
      </footer>

      <TitleDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
}

export default App;
