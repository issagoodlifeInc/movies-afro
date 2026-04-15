import { Routes, Route, Link } from 'react-router-dom';

function Home() {
  return (
    <main>
      <h1>Movie Streaming</h1>
      <p>Browse featured movies and stream from your library.</p>
      <Link to="/movies">Browse movies</Link>
    </main>
  );
}

function Movies() {
  return (
    <main>
      <h1>Movies</h1>
      <p>Movie catalog will load from the backend API.</p>
    </main>
  );
}

function App() {
  return (
    <div className="app-shell">
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/movies">Movies</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
      </Routes>
    </div>
  );
}

export default App;
